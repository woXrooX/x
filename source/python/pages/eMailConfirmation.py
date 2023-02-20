# Flask
from __main__ import app, request, render_template, make_response, session

# Home Made
from __main__ import CONF, USER_TYPES, MySQL

import json

from python.tools.tools import pageGuard, updateSessionUser

#################################################### Demo
@app.route("/eMailConfirmation", methods=["GET", "POST"])
@pageGuard("eMailConfirmation")
def eMailConfirmation():
    if request.method == "GET": return render_template("index.html", **globals())

    if request.method == "POST":

        # unknownError(s)
        if(
            # If No "for" In Request
            "for" not in request.get_json() or

            # "for" Meant To Go Other Route
            request.get_json()["for"] != "eMailConfirmation" or

            # If No "verificationCode" Key
            "verificationCode" not in request.get_json()["fields"]
        ):
            return make_response(json.dumps({
                "type": "error",
                "message": "unknownError"
            }), 200)


        # Check If Verification Code Is Empty
        if request.get_json()["fields"]["verificationCode"] == '':
            return make_response(json.dumps({
                "type": "error",
                "message": "eMailConfirmationCodeEmpty",
                "field": "verificationCode"
            }), 200)


        # Check If Verification Code Does Not Match
        if int(request.get_json()["fields"]["verificationCode"]) != session["user"]["eMail_verification_code"]:
            with MySQL(False) as db:
                db.execute(
                    ("UPDATE users SET eMail_verification_attempts_count=%s WHERE id=%s"),
                    ((session["user"]["eMail_verification_attempts_count"] + 1), session["user"]["id"])
                )
                db.commit()

                if db.hasError():
                    return make_response(json.dumps({
                        "type": "error",
                        "message": "databaseError",
                    }), 200)

                # Update The session["user"] After The Changes To The Database
                updateSessionUser()

            return make_response(json.dumps({
                "type": "warning",
                "message": "eMailConfirmationCodeDidNotMatch",
                "field": "verificationCode"
            }), 200)


        # Success | Match
        if int(request.get_json()["fields"]["verificationCode"]) == session["user"]["eMail_verification_code"]:
            with MySQL(False) as db:
                db.execute(
                    ("UPDATE users SET eMail_verification_attempts_count=%s, type=%s  WHERE id=%s"),
                    ((session["user"]["eMail_verification_attempts_count"] + 1), USER_TYPES["authorized"]["id"], session["user"]["id"])
                )
                db.commit()

                if db.hasError():
                    return make_response(json.dumps({
                        "type": "error",
                        "message": "databaseError",
                    }), 200)

                # Update The session["user"] After The Changes To The Database
                updateSessionUser()

            return make_response(json.dumps({
                "type": "success",
                "message": "success",
                "actions": {
                    "toast": {
                        "type": "success",
                        "content": "eMailVerificationSuccess"
                    },
                    "redirect": {
                        "url": "home"
                    }
                }
            }), 200)
