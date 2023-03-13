# Flask
from __main__ import app, request, render_template, make_response, session

# Home Made
from __main__ import CONF, USER_TYPES, MySQL, EXTERNALS

import json

from python.tools.tools import pageGuard, updateSessionUser

#################################################### Demo
@app.route("/eMailConfirmation", methods=["GET", "POST"])
@pageGuard("eMailConfirmation")
def eMailConfirmation():
    if request.method == "GET": return render_template("index.html", **globals())

    if request.method == "POST":
        # Check If "for" Meant To Go To Here
        if request.form["for"] != "eMailConfirmation":
            return make_response(json.dumps({
                "type": "warning",
                "message": "unknownError"
            }), 200)

        # Check For Existentance Of "verificationCode"
        if(
            # If No "verificationCode" Key In Request
            "verificationCode" not in request.form or

            # Check If Verification Code Is Empty
            "verificationCode" in request.form and request.form["verificationCode"] == ''
        ):
            return make_response(json.dumps({
                "type": "error",
                "message": "eMailConfirmationCodeEmpty",
                "field": "verificationCode"
            }), 200)


        # Check If Verification Code Does Not Match Then Increment The Counter
        if int(request.form["verificationCode"]) != session["user"]["eMail_verification_code"]:
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
        if int(request.form["verificationCode"]) == session["user"]["eMail_verification_code"]:
            with MySQL(False) as db:
                db.execute(
                    ("UPDATE users SET eMail_verification_attempts_count=%s, type=%s  WHERE id=%s"),
                    (
                        (session["user"]["eMail_verification_attempts_count"] + 1),
                        USER_TYPES["authorized"]["id"],
                        session["user"]["id"],
                    )
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
