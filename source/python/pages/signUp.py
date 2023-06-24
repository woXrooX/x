import re, random
from main import app, request, render_template, session

from python.modules.GMail import GMail
from python.modules.SendGrid import SendGrid
from python.modules.FileSystem import FileSystem
from python.modules.response import response
from python.modules.pageGuard import pageGuard
from python.modules.Globals import Globals
from python.modules.User import User
from python.modules.MySQL import MySQL




#################################################### Sign Up
@app.route("/signUp", methods=["GET", "POST"])
@pageGuard("signUp")
def signUp():
    if request.method == "GET": return render_template("index.html", **globals())

    if request.method == "POST":

        # unknownError
        if request.form["for"] != "signUp":
            return response(type="warning", message="unknownError")

        ######## eMail
        # eMailEmpty
        if "eMail" not in request.form or not request.form["eMail"]:
            return response(type="error", message="eMailEmpty", field="eMail")

        # eMailInvalid
        if not re.match(Globals.CONF["eMail"]["regEx"], request.form["eMail"]):
            return response(type="error", message="eMailInvalid", field="eMail")

        ######## password
        # passwordEmpty
        if "password" not in request.form or not request.form["password"]:
            return response(type="error", message="passwordEmpty", field="password")

        # passwordMinLength
        if len(request.form["password"]) < Globals.CONF["password"]["min_length"]:
            return response(type="error", message="passwordMinLength", field="password")

        # passwordMaxLength
        if len(request.form["password"]) > Globals.CONF["password"]["max_length"]:
            return response(type="error", message="passwordMaxLength", field="password")

        # passwordAllowedChars
        if not re.match(Globals.CONF["password"]["regEx"], request.form["password"]):
            return response(type="error", message="passwordAllowedChars", field="password")

        ######## eMail and Password In Use
        # eMailInUse
        data = MySQL.execute(sql="SELECT id FROM users WHERE eMail=%s", params=(request.form["eMail"], ), fetchOne=True)
        if data: return response(type="error", message="eMailInUse", field="eMail")

        # passwordInUse
        data = MySQL.execute(sql="SELECT id FROM users WHERE password=%s", params=(request.form["password"], ), fetchOne=True)
        if data: return response(type="error", message="passwordInUse", field="password")

        ######## Success
        # Generate Randome Verification Code
        eMailVerificationCode = random.randint(100000, 999999)

        # Insert To Database
        data = MySQL.execute(
            sql="INSERT INTO users (password, eMail, eMail_verification_code, authenticity_status) VALUES (%s, %s, %s, %s)",
            params=(
                request.form["password"],
                request.form["eMail"],
                eMailVerificationCode,
                Globals.USER_AUTHENTICITY_STATUSES["unauthorized"]["id"]
            ),
            commit=True
        )

        if not data: return response(type="error", message="databaseError")

        # Get User Data
        data = MySQL.execute(
            sql="SELECT id FROM users WHERE eMail=%s AND password=%s",
            params=(
                request.form["eMail"],
                request.form["password"]
            ),
            fetchOne=True
        )

        if not data: return response(type="error", message="databaseError")


        # Set Session User Data
        session["user"] = data

        # Handle The Session Update Error
        if not User.updateSession():
            pass

        # Setup Dirs
        if FileSystem.initUserFolders() == False:
            # Handle Folder Creation Errors
            pass


        #### Check If Verification Code Sent Successfully
        emailVerificationSentSuccessfully = False

        # Gmail
        if GMail(request.form["eMail"], eMailVerificationCode) is True: emailVerificationSentSuccessfully = True

        # SendGrid
        if SendGrid.send("noreply", request.form["eMail"], eMailVerificationCode, "Sign Up") is True: emailVerificationSentSuccessfully = True

        # Success
        return response(
            type="success" if emailVerificationSentSuccessfully is True else "info",
            message="eMailConfirmationCodeHasBeenSent" if emailVerificationSentSuccessfully is True else "Signed Up Without Email Verification!",
            setSessionUser=True,
            toast=True,
            redirect="eMailConfirmation" if emailVerificationSentSuccessfully is True else "home",
            domChange=["menu"]
        )
