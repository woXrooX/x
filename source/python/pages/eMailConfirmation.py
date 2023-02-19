# Flask
from __main__ import app, request, render_template, make_response, session

# Home Made
from __main__ import CONF, MySQL, publicSessionUser
import json


#################################################### Demo
@app.route("/eMailConfirmation", methods=["GET", "POST"])
def eMailConfirmation():
    if request.method == "GET": return render_template("index.html", **globals())
    if request.method == "POST":
        
        # Check if verification code matches
        if session["user"]["eMail_verification_code"] == int(request.get_json()["fields"]["verificationCode"]):
            with MySQL(False) as db:
                db.execute(
                    ("SELECT * FROM users WHERE eMail=%s AND password=%s"),
                    (
                        request.get_json()["fields"]["eMail"],
                        request.get_json()["fields"]["password"]
                    )
                )
            return make_response(json.dumps({
                "type": "success",
                "message": "success",
                "actions": {
                    "setSessionUser": publicSessionUser(),
                    "redirect": {
                        "url": "home"
                    },
                }
            }))
        else:
            session["user"]["eMail_verification_attempts_count"] += 1
            session.modified = True
            if session["user"]["eMail_verification_attempts_count"] > 3:
                return make_response(json.dumps({
                    "type": "error",
                    "message": "databaseError",
                }), 200)
            
            return make_response(json.dumps({
                "type": "error",
                "message": "eMailVerificationCodeNotValid",
            }), 200)