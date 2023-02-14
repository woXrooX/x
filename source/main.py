#################################################### IMPORTS
from flask import Flask, render_template, request, session, redirect, url_for, make_response
import json, yaml, re, html
import pathlib # APP_RUNNING_FROM
import os # For Creating Folders, Checking if project.json exists
import sys # for eixt
# import stripe
from functools import wraps # For pageGuard() Wrapper

#################################################### GLOBAL appRunningFrom
APP_RUNNING_FROM = pathlib.Path(__file__).parent.absolute()


#################################################### PROJECT Dependent Configurations
# Check If project.json exists
if not os.path.exists(f"{APP_RUNNING_FROM}/project.json"):
    print("------------ Error ------------")
    print(f"{APP_RUNNING_FROM}/project.json does not exist.")
    sys.exit()

# If Exists Open It
with open(f"{APP_RUNNING_FROM}/project.json", 'r') as file:
    PROJECT = json.load(file)


#################################################### GLOBAL config
with open(f"{APP_RUNNING_FROM}/yaml/config.yaml", 'r') as file:
    CONF = yaml.safe_load(file)

#### Merge Project Dependent Configurations To X-WebApp Configurations
# Database
if "database" in PROJECT: CONF["database"] = PROJECT["database"]

# Defaults
if "default" in PROJECT: CONF["default"] = PROJECT["default"]

# Menu
if "menu" in PROJECT: CONF["menu"] = PROJECT["menu"]

# Pages
if "pages" in PROJECT: CONF["pages"] = PROJECT["pages"]

# Public Version Of CONF (Minus Senstive Data)
PUBLIC_CONF = {
    "default": CONF["default"],
    "menu": CONF["menu"],
    "pages": CONF["pages"],
    "username": CONF["username"],
    "password": CONF["password"],
    "phoneNumber": CONF["phoneNumber"],
    "eMail": CONF["eMail"]

}


#################################################### GLOBAL tools
from python.tools.MySQL import MySQL
# import python.tools.tools as tools

"""

@wraps(func)

The functools.wraps function is a decorator used to preserve metadata of a decorated function,
such as the name, docstring, and argument signature, to the wrapped function.
When you use the functools.wraps decorator,
it takes the original function as an argument and returns a new function that has the same metadata as the original function.

"""

# Page Guard
def pageGuard(page):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Check If Page Exists
            if page not in CONF["pages"]: return redirect(url_for("home"))

            # Is Page Enabled
            if CONF["pages"][page]["enabled"] == False: return redirect(url_for("home"))

            # Looping Through Page's Allowed List
            for allowed in CONF["pages"][page]["allowed"]:
                # Only Allowed "unauthenticated" Users
                if allowed == "unauthenticated" and "user" in session: return redirect(url_for("home"))

                # Only Allowed "unauthorized" Users
                if allowed == "unauthorized" and "user" not in session: return redirect(url_for("home"))

                # Only Allowed "authorized" Users
                # Retrive authorized_type_id From Database
                # authorized_type_id = 5
                # if allowed == "authorized":
                #     if "user" not in session or "user" in session and session["user"]["type"] != authorized_type_id:
                #         return redirect(url_for("home"))

            return func(*args, **kwargs)

        return wrapper

    return decorator

def publicSessionUser():
    # Check If User In Session
    if "user" not in session: return None

    publicData = {
        "username": session["user"]["username"],
        "firstname": session["user"]["firstname"],
        "lastname": session["user"]["lastname"]

    }

    return publicData


#################################################### URL
URL = f'{CONF["URL"]["prefix"]}://{CONF["URL"]["domain_name"]}:{CONF["URL"]["port"]}/'


#################################################### Flask APP
app = Flask(
    __name__,
    root_path = CONF["root_path"],
    template_folder = CONF["template_folder"],
    static_folder = CONF["static_folder"]
)

app.secret_key = b'asZ8#Q!@97_+asQ]s/s\]/'


#################################################### GLOBAL MySQL
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


#################################################### GLOBAL language
### languages
# with MySQL(False) as db:
#     db.execute(f"SELECT * FROM languages")
#     languages = db.fetchAll()

### language Default Code
langCode = CONF["default"]["language"]

### language Dictionary
with open(f'{APP_RUNNING_FROM}/json/languageDictionary.json', encoding="utf8") as file:
    langDict = json.load(file)


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


#####################################################################################
######################################## PAGES ######################################
#####################################################################################

import python.pages.home
import python.pages.signUp
import python.pages.logIn
import python.pages.logOut
# import python.pages.me
# import python.pages.plans
import python.pages.privacyPolicy
import python.pages.termsOfUse
import python.pages.contact

import python.pages.api

import python.pages.page_not_found

import python.pages.demo

#################################################### RUN
### Flask server
if __name__ == "__main__":
    # No SSL
    app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True)

    # OpenSSL
    # app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True, ssl_context=('SSL/cert.pem', 'SSL/key.pem'))
