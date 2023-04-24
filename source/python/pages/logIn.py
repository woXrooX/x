from main import app, request, render_template, session
from python.modules.tools import pageGuard, publicSessionUser
from python.modules.response import response
from python.modules.Globals import Globals
from python.modules.MySQL import MySQL


#################################################### Log In
@app.route("/logIn", methods=["GET", "POST"])
@pageGuard("logIn")
def logIn():
    if request.method == "GET": return render_template("index.html", **globals())

    if request.method == "POST":
        # unknownError
        if request.form["for"] != "logIn":
            return response(type="warning", message="unknownError")

        ######## eMail
        # eMailEmpty
        if "eMail" not in request.form or not request.form["eMail"]:
            return response(type="error", message="eMailEmpty", field="eMail")

        ######## password
        # passwordEmpty
        if "password" not in request.form or not request.form["password"]:
            return response(type="error", message="passwordEmpty", field="password")

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
                return response(type="error", message="databaseError")

            dataFetched = db.fetchOne()

            # No Match
            if dataFetched is None:
                return response(type="error", message="usernameOrPasswordWrong")

            # Set Session User Data
            session["user"] = dataFetched

            # On Success Redirect & Update Front-End Session
            return response(
                type="success",
                message="success",
                setSessionUser=True,
                redirect="home",
                domChange=["menu"]
            )
