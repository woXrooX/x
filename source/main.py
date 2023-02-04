#################################################### IMPORTS
from python.MySQL import MySQL
from flask import Flask, render_template, request, session, redirect, url_for, make_response
import json, yaml, re, html, pathlib
import stripe


#################################################### GLOBAL appRunningFrom
APP_RUNNING_FROM = pathlib.Path(__file__).parent.absolute()


#################################################### GLOBAL config
with open(f"{APP_RUNNING_FROM}/yaml/config.yaml", 'r') as file:
    conf = yaml.safe_load(file)


#################################################### GLOBAL tools
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

# with MySQL(False) as db:
#     db.execute(f"SELECT * FROM users")
#     users = db.fetchall()
#     print(users)


#################################################### GLOBAL language
### languages
# with MySQL(False) as db:
#     db.execute(f"SELECT * FROM languages")
#     languages = db.fetchall()

### language Default Code
langCode = conf["default"]["language"]

### language Dictionary
with open(f'{APP_RUNNING_FROM}/json/languageDictionary.json', encoding="utf8") as file:
    langDict = json.load(file)


#################################################### GLOBAL currencies
### currencies
# with MySQL(False) as db:
#     db.execute("SELECT * FROM currencies")
#     currencies = db.fetchall()

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

# stripe.api_key = conf['stripe_payment']['sk_key']

@app.route("/", methods=["GET", "POST"])
@app.route("/home", methods=["GET", "POST"])
# def home():
#     session = stripe.checkout.Session.create(
#         payment_method_types=['card'],
#         line_items=[{
#             'price': 'price_1MO2KSAh3t85mIMGoprvVse6',
#             'quantity': 1
#         }],
#         mode='payment',
#         success_url=url_for('home', _external=True) + '?session_id={CHECKOUT_SESSION_ID}',
#         cancel_url=url_for('home', _external=True)
#     )
#     return render_template('index.html', checkout_session_id=session['id'], checkout_public_key=conf['stripe_payment']['pb_key'], TITLE="Yzoken", **globals())
def home():
    def main():
        main = f"""Main"""
        return main

    if request.method == "GET":
        return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)


#################################################### Sign Up
@app.route("/signUp", methods=["GET", "POST"])
def signUp():
    if conf["features"]["signUp"] == False:
        return redirect(url_for('home'))
 
    if request.method == "GET":
        return render_template("index.html", **globals())

    if request.method == "POST":

        # unknownError
        if request.get_json()['for'] != 'signUp':
            return make_response(json.dumps({
                "type": "warning",
                "message": "unknownError"
            }), 200)

        #### eMail
        # eMailEmpty
        if 'eMail' not in request.get_json()['fields'] or not request.get_json()['fields']['eMail']:
            return make_response(json.dumps({
                "type": "error",
                "message": "eMailEmpty",
                "field": "eMail"
            }), 200)

        # eMailInvalid
        if not re.match(conf['eMail']['regEx'], request.get_json()['fields']['eMail']):
            return make_response(json.dumps({
                "type": "error",
                "message": "eMailInvalid",
                "field": "eMail"
            }), 200)

        #### password
        # passwordEmpty
        if 'password' not in request.get_json()['fields'] or not request.get_json()['fields']['password']:
            return make_response(json.dumps({
                "type": "error",
                "message": "passwordEmpty",
                "field": "password"
            }), 200)

        # passwordMinLength
        if len(request.get_json()['fields']['password']) < conf['password']['min_length']:
            return make_response(json.dumps({
                "type": "error",
                "message": "passwordMinLength",
                "field": "password"
            }), 200)
        
        # passwordMaxLength
        if len(request.get_json()['fields']['password']) > conf['password']['max_length']:
            return make_response(json.dumps({
                "type": "error",
                "message": "passwordMaxLength",
                "field": "password"
            }), 200)

        # passwordAllowedChars
        if not re.match(conf['password']['regEx'], request.get_json()['fields']['password']):
            return make_response(json.dumps({
                "type": "error",
                "message": "passwordAllowedChars",
                "field": "password"
            }), 200)
        
        #### eMail and Password DB
        # eMailInUse
        with MySQL(False) as db:
            db.execute("SELECT eMail from users WHERE eMail=%s", request.get_json()['fields']['eMail'])
            fetchedData  = db.fetchone()
            if fetchedData:
                return make_response(json.dumps({
                    "type": "error",
                    "message": "eMailInUse",
                    "field": "eMail"
                }))

        # passwordInUse
        with MySQL(False) as db:
            db.execute("SELECT password from users WHERE password=%s", request.get_json()['fields']['password'])
            fetchedData  = db.fetchone()
            if fetchedData:
                return make_response(json.dumps({
                    "type": "error",
                    "message": "passwordInUse",
                    "field": "password"
                }))
               
        #### success
        with MySQL(False) as db:
            db.execute(
                ("INSERT INTO users (eMail, password) VALUES (%s, %s)"),
                (
                    request.get_json()['fields']['eMail'],
                    request.get_json()['fields']['password']
                )
            )
            db.commit()
            if db.hasError:
                return make_response(json.dumps({
                    "type": "error",
                    "message": "databaseError",
                }), 200)

            session['user'] = request.get_json()['fields']['eMail']

            #success
            return make_response(json.dumps({
                "type": "success",
                "message": "success",
                "action": "redirect",
                "url": "/"
            }), 200)

#################################################### Log In
@app.route("/logIn", methods=["GET", "POST"])
def logIn():
    if conf["features"]["logIn"] == False:
        return redirect(url_for('home'))

    if request.method == "GET":
        return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({
            "type": "success",
            "message": "databaseError"
        }), 200)

        # return make_response(json.dumps({
            # "type": "success",
            # "type": "info",
            # "type": "warning",
            # "type": "error",
            #
            # "message": "someSuccessMessage", # From Lang Dict
            # "field": "username" # From Front-End Form Name OR ID Or For
            #
            # "action": "redirect",
            # "url": "/me"
            #
            # "action": "reload"
        #
        # }), 200)


#################################################### Log Out
@app.route("/logOut", methods=["GET", "POST"])
def logOut():
    if conf["features"]["logOut"] == False:
        return redirect(url_for('home'))

    if request.method == "GET":
        return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)


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
    if request.method == "GET":
        return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)


#################################################### Terms Of Use
@app.route("/termsOfUse", methods=["GET", "POST"])
def termsOfUse():
    if request.method == "GET":
        return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)


#################################################### Contact
@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "GET":
        return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)


#################################################### none/404
@app.errorhandler(404)
def page_not_found(error):
    return redirect(url_for('home'))


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
                    "username": conf["username"],
                    "password": conf["password"],
                    "phoneNumber": conf["phoneNumber"],
                    "eMail": conf["eMail"]
                },
                # "session":session["user"] if "user" in session else None,
                "langDict": langDict,
                "langCode": langCode,
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
    if request.method == "GET":
        return render_template("index.html", **globals())


#################################################### RUN
### Flask server
if __name__ == "__main__":
    # No SSL
    app.run(host=conf["URL"]["domain_name"], port=conf["URL"]["port"], debug=True, threaded=True)

    # OpenSSL
    # app.run(host=conf["URL"]["domain_name"], port=conf["URL"]["port"], debug=True, threaded=True, ssl_context=('SSL/cert.pem', 'SSL/key.pem'))
