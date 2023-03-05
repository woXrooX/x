# Flask
from __main__ import app, request, render_template, make_response

# Utils
from __main__ import json

# Home Made
from __main__ import CONF, MySQL, session

from python.tools.tools import pageGuard, publicSessionUser


#################################################### Log In
@app.route("/logIn", methods=["GET", "POST"])
@pageGuard("logIn")
def logIn():
    if request.method == "GET": return render_template("index.html", **globals())

    if request.method == "POST":
        # unknownError
        if request.form["for"] != "logIn":
            return make_response(json.dumps({
                "type": "warning",
                "message": "unknownError"
            }), 200)

        ######## eMail
        # eMailEmpty
        if "eMail" not in request.form or not request.form["eMail"]:
            return make_response(json.dumps({
                "type": "error",
                "message": "eMailEmpty",
                "field": "eMail"
            }), 200)

        ######## password
        # passwordEmpty
        if "password" not in request.form or not request.form["password"]:
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
                    request.form["eMail"],
                    request.form["password"],
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

            # On Success Redirect & Update Front-End Session
            return make_response(json.dumps({
                "type": "success",
                "message": "success",
                "actions": {
                    "setSessionUser": publicSessionUser(),
                    "redirect": {
                        "url": "home"
                    },
                    "domChange": ["menu"]
                }
            }))
