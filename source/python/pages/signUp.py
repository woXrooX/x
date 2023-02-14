# Flask
from __main__ import app, request, render_template, make_response

# Utils
from __main__ import re, json

# Home Made
from __main__ import CONF, MySQL, pageGuard


#################################################### Sign Up
@app.route("/signUp", methods=["GET", "POST"])
@pageGuard("signUp")
def signUp():
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

            # On Success Redirect & Update Front-End Session
            return make_response(json.dumps({
                "type": "success",
                "message": "success",
                "actions": {
                    "setSessionUser": publicSessionUser(),
                    "redirect": {
                        "url": "home"
                    },
                    "domChange": {
                        "section": "menu"
                    }
                }
            }))
