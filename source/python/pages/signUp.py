# Flask
from __main__ import app, request, render_template

# Home Made
from __main__ import CONF, MySQL, USER_TYPES, session, EXTERNALS

import re, json, random

from python.tools.GMail import GMail

from python.tools import userFolders
from python.tools.response import response

from python.tools.tools import pageGuard, publicSessionUser




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
        if not re.match(CONF["eMail"]["regEx"], request.form["eMail"]):
            return response(type="error", message="eMailInvalid", field="eMail")

        ######## password
        # passwordEmpty
        if "password" not in request.form or not request.form["password"]:
            return response(type="error", message="passwordEmpty", field="password")

        # passwordMinLength
        if len(request.form["password"]) < CONF["password"]["min_length"]:
            return response(type="error", message="passwordMinLength", field="password")

        # passwordMaxLength
        if len(request.form["password"]) > CONF["password"]["max_length"]:
            return response(type="error", message="passwordMaxLength", field="password")

        # passwordAllowedChars
        if not re.match(CONF["password"]["regEx"], request.form["password"]):
            return response(type="error", message="passwordAllowedChars", field="password")

        ######## eMail and Password In Use
        # eMailInUse
        with MySQL(False) as db:
            db.execute("SELECT id FROM users WHERE eMail=%s", (request.form["eMail"], ))
            dataFetched  = db.fetchOne()
            if dataFetched:
                return response(type="error", message="eMailInUse", field="eMail")

        # passwordInUse
        with MySQL(False) as db:
            db.execute("SELECT id FROM users WHERE password=%s", (request.form["password"], ))
            dataFetched = db.fetchOne()
            if dataFetched:
                return response(type="error", message="passwordInUse", field="password")

        ######## Success
        # Generate Randome Verification Code
        eMailVerificationCode = random.randint(100000, 999999)

        # Check If Verification Code Sent Successfully
        if GMail(request.form["eMail"], eMailVerificationCode) == False:
            return response(type="error", message="couldNotSendEMailVerificationCode")

        # Insert To Database
        with MySQL(False) as db:
            db.execute(
                ("INSERT INTO users (password, eMail, eMail_verification_code, type) VALUES (%s, %s, %s, %s)"),
                (
                    request.form["password"],
                    request.form["eMail"],
                    eMailVerificationCode,
                    USER_TYPES["unauthorized"]["id"]
                )
            )
            db.commit()

            if db.hasError():
                return response(type="error", message="databaseError")

            # Get User Data
            with MySQL(False) as db:
                db.execute(
                    ("SELECT * FROM users WHERE eMail=%s AND password=%s"),
                    (
                        request.form["eMail"],
                        request.form["password"]
                    )
                )

                if db.hasError():
                    return response(type="error", message="databaseError")


                # Set Session User Data
                session["user"] = db.fetchOne()

            # Setup Dirs
            if userFolders.create() == False:
                # Handle Folder Creation Errors
                pass


            # On Success Redirect & Update Front-End Session
            return response(
                type="success",
                message="success",
                setSessionUser=True,
                toast={"type":"info","content":"eMailConfirmationCodeHasBeenSent"},
                redirect="eMailConfirmation",
                domChange=["menu"]
            )
