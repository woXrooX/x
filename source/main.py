#################################################### IMPORTS
from flask import Flask, render_template, request, session, redirect, url_for, make_response
import json, yaml, re, html, pathlib
import os # For Creating Folders
# import stripe


#################################################### GLOBAL appRunningFrom
APP_RUNNING_FROM = pathlib.Path(__file__).parent.absolute()


#################################################### GLOBAL config
with open(f"{APP_RUNNING_FROM}/yaml/config.yaml", 'r') as file:
    conf = yaml.safe_load(file)


#################################################### GLOBAL tools
from python.MySQL import MySQL
# import python.tools as tools

## Generates Menu Links Dynamically
def generateMenus():
    html = ''
    for menu in conf["features"]["menus"]:
        if (
            # If User Logged In Then Do Not Show Link For "logIn"
            (menu["name"] == "logOut" and 'user' in session) or

            # If User Is Not Logged In Then Show "logIn" And "signUp" Links
            ((menu["name"] == "signUp" or menu["name"] == "logIn") and 'user' not in session) or

            # If Current Menu Is Not Followings Then Just Show The Links
            (menu["name"] != "signUp" and menu["name"] != "logIn" and menu["name"] != "logOut")
        ):
            html += f"""
<a href="{url_for(menu['name'])}">
  <svg>
    <use href="#{menu['svg']}"></use>
  </svg>
  {langDict[menu["name"]][langCode]}
</a>
            """

    return html


#################################################### URL
URL = f'{conf["URL"]["prefix"]}://{conf["URL"]["domain_name"]}:{conf["URL"]["port"]}/'


#################################################### APP
app = Flask(
    __name__,
    root_path = conf["root_path"],
    template_folder = conf["template_folder"],
    static_folder = conf["static_folder"]
)

app.secret_key = b'asZ8#Q!@97_+asQ]s/s\]/'


#################################################### GLOBAL MySQL
MySQL.setUp(
    conf["database"]["user"],
    conf["database"]["password"],
    conf["database"]["host"],
    conf["database"]["name"],
    conf["database"]["charset"],
    conf["database"]["collate"]
)


#################################################### GLOBAL language
### languages
# with MySQL(False) as db:
#     db.execute(f"SELECT * FROM languages")
#     languages = db.fetchAll()

### language Default Code
langCode = conf["default"]["language"]

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
currencyCode = conf["default"]["currency"]


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


#################################################### HOME | Index | Landing
@app.route("/", methods=["GET", "POST"])
@app.route("/home", methods=["GET", "POST"])
def home():
    if request.method == "GET": return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)


#################################################### Sign Up
@app.route("/signUp", methods=["GET", "POST"])
def signUp():

    # Check If Feature Is Enabled
    if conf["features"]["signUp"] == False:
        return redirect(url_for('home'))

    # Check If User Already Logged In
    if 'user' in session: return redirect(url_for('home'))

    if request.method == "GET": return render_template("index.html", **globals())

    if request.method == "POST":

        # unknownError
        if "for" not in request.get_json() or request.get_json()["for"] != "signUp":
            return make_response(json.dumps({
                "type": "warning",
                "message": "unknownError"
            }), 200)

        # unknownError
        if "field" not in request.get_json() or request.get_json()["field"] != "all":
            return make_response(json.dumps({
                "type": "warning",
                "message": "unknownError"
            }), 200)

        ######## eMail
        # eMailEmpty
        if "eMail" not in request.get_json()["fields"] or not request.get_json()["fields"]["eMail"]:
            return make_response(json.dumps({
                "type": "error",
                "message": "eMailEmpty",
                "field": "eMail"
            }), 200)

        # eMailInvalid
        if not re.match(conf["eMail"]["regEx"], request.get_json()["fields"]["eMail"]):
            return make_response(json.dumps({
                "type": "error",
                "message": "eMailInvalid",
                "field": "eMail"
            }), 200)

        ######## password
        # passwordEmpty
        if "password" not in request.get_json()["fields"] or not request.get_json()["fields"]["password"]:
            return make_response(json.dumps({
                "type": "error",
                "message": "passwordEmpty",
                "field": "password"
            }), 200)

        # passwordMinLength
        if len(request.get_json()["fields"]["password"]) < conf["password"]["min_length"]:
            return make_response(json.dumps({
                "type": "error",
                "message": "passwordMinLength",
                "field": "password"
            }), 200)

        # passwordMaxLength
        if len(request.get_json()["fields"]["password"]) > conf["password"]["max_length"]:
            return make_response(json.dumps({
                "type": "error",
                "message": "passwordMaxLength",
                "field": "password"
            }), 200)

        # passwordAllowedChars
        if not re.match(conf["password"]["regEx"], request.get_json()["fields"]["password"]):
            return make_response(json.dumps({
                "type": "error",
                "message": "passwordAllowedChars",
                "field": "password"
            }), 200)

        ######## eMail and Password In Use
        # eMailInUse
        with MySQL(False) as db:
            db.execute("SELECT id FROM users WHERE eMail=%s", (request.get_json()["fields"]["eMail"], ))
            dataFetched  = db.fetchOne()
            if dataFetched:
                return make_response(json.dumps({
                    "type": "error",
                    "message": "eMailInUse",
                    "field": "eMail"
                }))

        # passwordInUse
        with MySQL(False) as db:
            db.execute("SELECT id FROM users WHERE password=%s", (request.get_json()["fields"]["password"], ))
            dataFetched = db.fetchOne()
            if dataFetched:
                return make_response(json.dumps({
                    "type": "error",
                    "message": "passwordInUse",
                    "field": "password"
                }))

        ######## Success
        # Insert To Database
        with MySQL(False) as db:
            db.execute(
                ("INSERT INTO users (eMail, password) VALUES (%s, %s)"),
                (
                    request.get_json()["fields"]["eMail"],
                    request.get_json()["fields"]["password"]
                )
            )
            db.commit()

            if db.hasError():
                return make_response(json.dumps({
                    "type": "error",
                    "message": "databaseError",
                }), 200)

            # Get User Data
            with MySQL(False) as db:
                db.execute(
                    ("SELECT * FROM users WHERE eMail=%s AND password=%s"),
                    (
                        request.get_json()["fields"]["eMail"],
                        request.get_json()["fields"]["password"]
                    )
                )

                if db.hasError():
                    return make_response(json.dumps({
                        "type": "error",
                        "message": "databaseError",
                    }), 200)


                # Set Session User Data
                session["user"] = db.fetchOne()

            # Setup Dirs
            try:
                os.makedirs(f'{APP_RUNNING_FROM}/users/{session["user"]["id"]}/images', mode=0o777, exist_ok=True)
            except:
                # catch for folder already exists
                pass

            # On Success Redirect
            return make_response(json.dumps({
                "type": "success",
                "message": "success",
                "action": "redirect",
                "url": "home"
            }), 200)

#################################################### Log In
@app.route("/logIn", methods=["GET", "POST"])
def logIn():

    # Check If Feature Is Enabled
    if conf["features"]["logIn"] == False:
        return redirect(url_for("home"))

    # Check If User Already Logged In
    if 'user' in session: return redirect(url_for('home'))

    if request.method == "GET": return render_template("index.html", **globals())

    if request.method == "POST":

        # unknownError
        if "for" not in request.get_json() or request.get_json()["for"] != "logIn":
            return make_response(json.dumps({
                "type": "warning",
                "message": "unknownError"
            }), 200)

        # unknownError
        if "field" not in request.get_json() or request.get_json()["field"] != "all":
            return make_response(json.dumps({
                "type": "warning",
                "message": "unknownError"
            }), 200)

        ######## eMail
        # eMailEmpty
        if "eMail" not in request.get_json()["fields"] or not request.get_json()["fields"]["eMail"]:
            return make_response(json.dumps({
                "type": "error",
                "message": "eMailEmpty",
                "field": "eMail"
            }), 200)

        ######## password
        # passwordEmpty
        if "password" not in request.get_json()["fields"] or not request.get_json()["fields"]["password"]:
            return make_response(json.dumps({
                "type": "error",
                "message": "passwordEmpty",
                "field": "password"
            }), 200)

        ######## Check If eMail And Password matching User Exist
        with MySQL(False) as db:
            db.execute(
                ("SELECT * FROM users WHERE eMail=%s AND password=%s"),
                (
                    request.get_json()["fields"]["eMail"],
                    request.get_json()["fields"]["password"],
                )
            )

            if db.hasError():
                return make_response(json.dumps({
                    "type": "error",
                    "message": "databaseError"
                }))

            dataFetched = db.fetchOne()

            # No Match
            if dataFetched is None:
                return make_response(json.dumps({
                    "type": "error",
                    "message": "usernameOrPasswordWrong"
                }))

            # Set Session User Data
            session["user"] = dataFetched

            # On Success Redirect
            return make_response(json.dumps({
                "type": "success",
                "message": "success",
                "action": "redirect",
                "url": "home"
            }))



        # return make_response(json.dumps({
            # "type": "success",
            # "type": "info",
            # "type": "warning",
            # "type": "error",
            #
            # "message": "someSuccessMessage", # From Lang Dict
            # "field": "username" # From Front-End Form Name OR ID Or For
            #
            # "actions": [
            #     {
            #         "name": "redirect",
            #         "url": "me",
            #     },
            #     {
            #         "name": "domChange",
            #         "section": "menu", # menu header main footer
            #     },
            #     {
            #         "name": "reload"
            #     },
            #
            # ]
        #
        # }), 200)


#################################################### Log Out
@app.route("/logOut", methods=["GET", "POST"])
def logOut():

    # Check If Feature Is Enabled
    if conf["features"]["logOut"] == False:
        return redirect(url_for("home"))

    # Check If User Already Logged Out
    if 'user' not in session: return redirect(url_for('home'))

    if request.method == "GET": return render_template("index.html", **globals())

    elif request.method == "POST":

        # Remove User From Session
        session.pop('user')

        # Reset Site Language To The Default
        global langCode
        langCode = conf["default"]["language"]

        # Redirect To Home
        return make_response(json.dumps({
            "type": "success",
            "message": "success",
            "actions": [
                {
                    "name": "redirect",
                    "url": "home",
                }            
            ]
        }), 200)


#################################################### Me | MyPage
@app.route("/me", methods=["POST"])
@app.route("/myPage", methods=["POST"])
def me():
    pass


#################################################### Plans & Pricing
@app.route("/plans", methods=["POST"])
@app.route("/pricing", methods=["POST"])
@app.route("/plansAndPricing", methods=["POST"])
def plansAndPricing():
    pass


#################################################### Privacy Policy
@app.route("/privacyPolicy", methods=["GET", "POST"])
def privacyPolicy():
    if request.method == "GET": return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)


#################################################### Terms Of Use
@app.route("/termsOfUse", methods=["GET", "POST"])
def termsOfUse():
    if request.method == "GET": return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)


#################################################### Contact
@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "GET": return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)


#################################################### none/404
@app.errorhandler(404)
def page_not_found(error):
    return redirect(url_for("home"))


#################################################### Bridge
@app.route("/bridge", methods=["POST"])
def bridge():
    # globalData
    if request.get_json()["for"] == "globalData":
        return make_response(
            {
                "type": "success",
                "conf": {
                    "default": conf["default"],
                    "features": conf["features"],
                    "username": conf["username"],
                    "password": conf["password"],
                    "phoneNumber": conf["phoneNumber"],
                    "eMail": conf["eMail"]
                },
                "session": session,
                "langCode": langCode,
                "langDict": langDict,
                # "languages":languages,
                # "currencies":currencies
            }, 200)

    # languages
    # if request.get_json()["for"] == "languages":
    #     return make_response(
    #         {
    #             "response":"ok",
    #             "languages":languages
    #         }, 200)

    # langCode
    if request.get_json()["for"] == "langCode":
        return make_response(
            {
                "response":"ok",
                "langCode":langCode
            }, 200)

    # langDict
    if request.get_json()["for"] == "langDict":
        return make_response(
            {
                "response":"ok",
                "langDict":langDict
            }, 200)

#################################################### Demo
@app.route("/demo", methods=["GET"])
def demo():
    if request.method == "GET": return render_template("index.html", **globals())


#################################################### RUN
### Flask server
if __name__ == "__main__":
    # No SSL
    app.run(host=conf["URL"]["domain_name"], port=conf["URL"]["port"], debug=True, threaded=True)

    # OpenSSL
    # app.run(host=conf["URL"]["domain_name"], port=conf["URL"]["port"], debug=True, threaded=True, ssl_context=('SSL/cert.pem', 'SSL/key.pem'))
