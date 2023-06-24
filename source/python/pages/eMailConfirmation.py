from main import app, request, render_template, session
from python.modules.pageGuard import pageGuard
from python.modules.response import response
from python.modules.Globals import Globals
from python.modules.User import User
from python.modules.MySQL import MySQL

#################################################### Demo
@app.route("/eMailConfirmation", methods=["GET", "POST"])
@pageGuard("eMailConfirmation")
def eMailConfirmation():
    if request.method == "GET": return render_template("index.html", **globals())

    if request.method == "POST":
        # Check If "for" Meant To Go To Here
        if request.form["for"] != "eMailConfirmation":
            return response(type="warning", message="unknownError")

        # Check For Existentance Of "verificationCode"
        if(
            # If No "verificationCode" Key In Request
            "verificationCode" not in request.form or

            # Check If Verification Code Is Empty
            "verificationCode" in request.form and request.form["verificationCode"] == ''
        ):
            return response(type="warning", message="eMailConfirmationCodeEmpty", field="verificationCode")

        # Check If Verification Code Does Not Match Then Increment The Counter
        if int(request.form["verificationCode"]) != session["user"]["eMail_verification_code"]:
            data = MySQL.execute(
                sql="UPDATE users SET eMail_verification_attempts_count=%s WHERE id=%s",
                params=((session["user"]["eMail_verification_attempts_count"] + 1), session["user"]["id"]),
                commit=True
            )

            if not data: return response(type="error", message="databaseError")

            # Update The session["user"] After The Changes To The Database
            updateSessionUser()

            return response(type="warning", message="eMailConfirmationCodeDidNotMatch", field="verificationCode")


        # Success | Match
        if int(request.form["verificationCode"]) == session["user"]["eMail_verification_code"]:
            data = MySQL.execute(
                sql="UPDATE users SET eMail_verification_attempts_count=%s, type=%s  WHERE id=%s",
                params=(
                    (session["user"]["eMail_verification_attempts_count"] + 1),
                    Globals.USER_TYPES["authorized"]["id"],
                    session["user"]["id"],
                ),
                commit=True
            )

            if not data: return response(type="error", message="databaseError")

            # Update The session["user"] After The Changes To The Database
            User.updateSession()

            return response(
                type="success",
                message="eMailVerificationSuccess",
                toast=True,
                redirect="home"
            )
