#################################################### IMPORTS
from flask import Flask, render_template, request, session, redirect, url_for, make_response

#################################################### Draw "The X"
from python.modules.Logger import Log
Log.clear()
Log.brand()

#################################################### Initializing File Structure
from python.modules.Globals import Globals
from python.modules.FileSystem import FileSystem

FileSystem.init()

#################################################### Imprting Global Data Holders
# from python.modules.FileSystem import CONF, LANG_DICT, PROJECT, PROJECT_CSS, PROJECT_SVG, PROJECT_LANG_DICT, PUBLIC_CONF

#################################################### GLOBAL MySQL
from python.modules.MySQL import MySQL
# If Database Enabled Then Set It Up
if "database" in Globals.CONF and Globals.CONF["database"]["enabled"] == True:
    MySQL.setUp(
        Globals.CONF["database"]["user"],
        Globals.CONF["database"]["password"],
        Globals.CONF["database"]["host"],
        Globals.CONF["database"]["name"],
        Globals.CONF["database"]["charset"],
        Globals.CONF["database"]["collate"]
    )

#################################################### GLOBAL user_types
if "database" in Globals.CONF and Globals.CONF["database"]["enabled"] == True:
    with MySQL(False) as db:
        db.execute("SELECT * FROM user_types")
        dataFetched = db.fetchAll()

        # Making USER_TYPES accessible by keyword like "root" or "dev"
        for user_type in dataFetched: Globals.USER_TYPES[user_type["name"]] = user_type


#################################################### Flask APP
app = Flask(
    __name__,
    root_path = Globals.CONF["flask"]["root_path"],
    template_folder = Globals.CONF["flask"]["template_folder"],
    static_folder = Globals.CONF["flask"]["static_folder"]
)

app.secret_key = Globals.CONF["flask"]["secret_key"]


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
