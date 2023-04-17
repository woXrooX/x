#################################################### IMPORTS
from flask import Flask, render_template, request, session, redirect, url_for, make_response
import json, yaml, re, html
import pathlib # APP_RUNNING_FROM
import os # For Creating Folders, Checking if project.json exists
import sys # for eixt
import shutil # To Copy
# import stripe

#################################################### GLOBAL APP_RUNNING_FROM
APP_RUNNING_FROM = pathlib.Path(__file__).parent.absolute()


#################################################### GLOBAL PARENT_RUNNING_FROM
# Go Back Two Times From "APP_RUNNING_FROM"
PARENT_RUNNING_FROM = os.path.abspath(os.path.join(APP_RUNNING_FROM, '../..'))

#################################################### Draw "The X"
from python.tools.Logger import Log
Log.clear()
Log.brand()


################################################################
################################################################ Initializing File Structure START
################################################################
from python.tools.FileSystem import FileSystem
FileSystem.init()


################################################################
################################################################ Initializing File Structure END
################################################################


################################################################
################################################################ Required Files And Folders To Run The Scipt START
################################################################


#################################################### project.json
try:
    with open(f"{PARENT_RUNNING_FROM}/project.json", 'r') as file:
        PROJECT = json.load(file)

    Log.success("Loaded: project.json")

except:
    Log.error("Could Not Reading The project.json")
    sys.exit()


#################################################### Copying Pages (Back-End)
try:
    files = os.listdir(PARENT_RUNNING_FROM+"/pages/back")

    for file in files:
        shutil.copy(PARENT_RUNNING_FROM+"/pages/back/"+file, str(APP_RUNNING_FROM)+"/python/pages")

    Log.success("Pages Are Copied (Back-End)")

except:
    Log.error("Could Not Copy The Pages (Back-End)")

    sys.exit()


#################################################### Copying Pages (Front-End)
try:
    files = os.listdir(PARENT_RUNNING_FROM+"/pages/front")

    for file in files:
        shutil.copy(PARENT_RUNNING_FROM+"/pages/front/"+file, str(APP_RUNNING_FROM)+"/js/pages")

    Log.success("Pages Are Copied (Front-End)")

except:
    Log.error("Could Not Copy The Pages (Front-End)")

    sys.exit()


################################################################
################################################################ Required Files And Folders To Run The Scipt END
################################################################


################################################################
################################################################ Not So Required Files And Folders To Run The Scipt START
################################################################

#################################################### EXTERNALS
EXTERNALS = {
    "SVG": {},
    "CSS": None
}

#################################################### PARENT_RUNNING_FROM/fonts
try:
    files = os.listdir(PARENT_RUNNING_FROM+"/fonts")

    for file in files:
        shutil.copy(PARENT_RUNNING_FROM+"/fonts/"+file, str(APP_RUNNING_FROM)+"/fonts")

    Log.success("Fonts Are Copied")

except:
    Log.error("Could Not Copy The Fonts")


#################################################### PARENT_RUNNING_FROM/SVG
# SVG FIles
for file in os.listdir(f'{PARENT_RUNNING_FROM}/SVG'):
    # Check If File Is A SVG File
    if not file.endswith(".svg"): continue

    try:
        with open(f'{PARENT_RUNNING_FROM}/SVG/{file}', "r") as svg:
            EXTERNALS["SVG"][os.path.splitext(file)[0]] = svg.read()

        Log.success(f"SVG File Loaded: {file}")

    except:
        Log.error(f"Could Not Load The SVG File: {file}")


#################################################### Load External CSS
try:
    with open(f'{PARENT_RUNNING_FROM}/CSS/styles.css', "r") as css:
        EXTERNALS["CSS"] = css.read()

    Log.success("External CSS Files Are Loaded")

except:
    Log.error("Could Not Read The External CSS")


################################################################
################################################################ Not So Required Files And Folders To Run The Scipt END
################################################################


#################################################### Default Config
with open(f"{APP_RUNNING_FROM}/yaml/config.yaml", 'r') as file:
    CONF = yaml.safe_load(file)

#### Merge Project Dependent Configurations To Default Configurations. Override Defaults
# Database
if "database" in PROJECT:
    if "database" in CONF: CONF["database"].update(PROJECT["database"])
    else: CONF["database"] = PROJECT["database"]

# eMail
if "eMail" in PROJECT:
    CONF["eMail"].update(PROJECT["eMail"])

# Defaults
if "default" in PROJECT:
    if "default" in CONF: CONF["default"].update(PROJECT["default"])
    else: CONF["default"] = PROJECT["default"]

# Menu
if "menu" in PROJECT:
    CONF["menu"] = PROJECT["menu"]

# Pages
if "pages" in PROJECT:
    CONF["pages"] = PROJECT["pages"]

# OpenAI
if "OpenAI" in PROJECT:
    CONF["OpenAI"] = PROJECT["OpenAI"]

# Public Version Of CONF (Minus Senstive Data)
PUBLIC_CONF = {
    "default": CONF["default"],
    "menu": CONF["menu"],
    "pages": CONF["pages"],
    "username": CONF["username"],
    "password": CONF["password"],
    "phoneNumber": CONF["phoneNumber"],

}


#################################################### URL
URL = f'{CONF["URL"]["prefix"]}://{CONF["URL"]["domain_name"]}:{CONF["URL"]["port"]}/'


#################################################### GLOBAL MySQL
from python.tools.MySQL import MySQL
# If Database Enabled Then Set Up
if "database" in CONF and CONF["database"]["enabled"] == True:
    MySQL.setUp(
        CONF["database"]["user"],
        CONF["database"]["password"],
        CONF["database"]["host"],
        CONF["database"]["name"],
        CONF["database"]["charset"],
        CONF["database"]["collate"]
    )


#################################################### GLOBAL user_types
USER_TYPES = {}
if "database" in CONF and CONF["database"]["enabled"] == True:
    with MySQL(False) as db:
        db.execute("SELECT * FROM user_types")
        dataFetched = db.fetchAll()

        # Making USER_TYPES accessible by keyword like "root" or "dev"
        for user_type in dataFetched: USER_TYPES[user_type["name"]] = user_type


#################################################### GLOBAL tools
# import python.tools.tools as tools
# from python.tools.tools import pageGuard, publicSessionUser


#################################################### GLOBAL language
### languages
# with MySQL(False) as db:
#     db.execute(f"SELECT * FROM languages")
#     languages = db.fetchAll()

### language Dictionary
with open(f'{APP_RUNNING_FROM}/json/languageDictionary.json', encoding="utf8") as file:
    langDict = json.load(file)


#################################################### External Language Dictionary
PROJECT_LANG_DICT = {}

try:
    with open(f"{PARENT_RUNNING_FROM}/languageDictionary.json", 'r') as file:
        PROJECT_LANG_DICT = json.load(file)

    Log.success("languageDictionary.json Is Loaded")

except:
    Log.error("Could Not Read The External languageDictionary.json")

# Override The langDict With External "languageDictionary.json"
langDict.update(PROJECT_LANG_DICT)


#################################################### GLOBAL currencies
### currencies
# with MySQL(False) as db:
#     db.execute("SELECT * FROM currencies")
#     currencies = db.fetchAll()

# with MySQL() as db:
#     db.execute(
#         ("SELECT * FROM users WHERE eMail=%s AND password=%s"),
#         (
#             "aa@gmail.com",
#             "asdasdA_2"
#         )
#     )
#     dataFetched = db.fetchOne()
#     print(dataFetched)


### currency Default Code
# currencyCode = CONF["default"]["currency"]


#################################################### Flask APP
app = Flask(
    __name__,
    root_path = CONF["flask"]["root_path"],
    template_folder = CONF["flask"]["template_folder"],
    static_folder = CONF["flask"]["static_folder"]
)

app.secret_key = CONF["flask"]["secret_key"]


#################################################### Decorations
# @app.before_first_request
# def app_init():
#     return None

# @app.before_request
# def before_request():
#     pass

# @app.after_request
# def after_request(response):
#     return response

# @app.teardown_request
# def teardown_request_func(error=None):
#     return None


#################################################### Dynamically Improting All Pages
from python.pages import *


#################################################### RUN (For Development)
### Flask server
# if __name__ == "__main__":
    # No SSL
    # app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True)

    # OpenSSL
    # app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True, ssl_context=('SSL/cert.pem', 'SSL/key.pem'))
