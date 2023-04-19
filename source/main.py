#################################################### IMPORTS
from flask import Flask, render_template, request, session, redirect, url_for, make_response
import json, yaml, re, html
import pathlib # X_RUNNING_FROM
import os # For Creating Folders, Checking if project.json exists
import sys # for eixt
import shutil # To Copy
# import stripe

#################################################### GLOBAL X_RUNNING_FROM
X_RUNNING_FROM = pathlib.Path(__file__).parent.absolute()

#################################################### GLOBAL PROJECT_RUNNING_FROM
# Go Back Two Times From "X_RUNNING_FROM"
PROJECT_RUNNING_FROM = os.path.abspath(os.path.join(X_RUNNING_FROM, '../..'))

#################################################### Draw "The X"
from python.tools.Logger import Log
Log.clear()
Log.brand()

#################################################### Initializing File Structure
from python.tools.FileSystem import FileSystem
FileSystem.init()

#################################################### Imprting Global Data Holders
from python.tools.FileSystem import CONF, LANG_DICT, PROJECT, PROJECT_CSS, PROJECT_SVG, PROJECT_LANG_DICT, PUBLIC_CONF

#################################################### URL
URL = f'{CONF["URL"]["prefix"]}://{CONF["URL"]["domain_name"]}:{CONF["URL"]["port"]}/'

#################################################### GLOBAL MySQL
from python.tools.MySQL import MySQL
# If Database Enabled Then Set It Up
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

#################################################### GLOBAL language
### languages
# with MySQL(False) as db:
#     db.execute(f"SELECT * FROM languages")
#     languages = db.fetchAll()


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


#################################################### Dynamically Imprting All Pages
from python.pages import *


#################################################### RUN (For Development)
### Flask server
# if __name__ == "__main__":
    # No SSL
    # app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True)

    # OpenSSL
    # app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True, ssl_context=('SSL/cert.pem', 'SSL/key.pem'))
