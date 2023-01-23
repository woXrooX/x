#################################################### IMPORTS
from python.MySQL import MySQL
from flask import Flask, render_template, request, session, redirect, url_for, make_response
import json, yaml, re, html, pathlib
import stripe


#################################################### GLOBAL tools
# import python.tools as tools


#################################################### GLOBAL appRunningFrom
APP_RUNNING_FROM = pathlib.Path(__file__).parent.absolute()


#################################################### GLOBAL config
with open(f"{APP_RUNNING_FROM}/yaml/config.yaml", 'r') as file:
    conf = yaml.safe_load(file)


#################################################### URL
URL = f'{conf["URL"]["prefix"]}://{conf["URL"]["domain_name"]}:{conf["URL"]["port"]}/'


#################################################### APP
app = Flask(
    __name__,
    root_path = conf["root_path"],
    template_folder = conf["template_folder"],
    static_folder = conf["static_folder"]
)

# app.secret_key = b'asZ8#Q!@97_+asQ]s/s\]/'


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
langCode = conf["site_language"]

### language Dictionary
with open(f'{APP_RUNNING_FROM}/json/languageDictionary.json', encoding="utf8") as file:
    langDict = json.load(file)


#################################################### GLOBAL currencies
### currencies
# with MySQL(False) as db:
#     db.execute("SELECT * FROM currencies")
#     currencies = db.fetchall()

### currency Default Code
currencyCode = conf["currency"]


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

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)


#################################################### Log In
@app.route("/logIn", methods=["GET", "POST"])
def logIn():
    if conf["features"]["logIn"] == False:
        return redirect(url_for('home'))

    if request.method == "GET":
        return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)


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


#################################################### RUN
### Flask server
if __name__ == "__main__":
    # No SSL
    app.run(host=conf["URL"]["domain_name"], port=conf["URL"]["port"], debug=True, threaded=True)

    # OpenSSL
    # app.run(host=conf["URL"]["domain_name"], port=conf["URL"]["port"], debug=True, threaded=True, ssl_context=('SSL/cert.pem', 'SSL/key.pem'))
