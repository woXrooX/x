from main import app, request, render_template, session
from python.modules.pageGuard import pageGuard
from python.modules.response import response
from python.modules.Globals import Globals


#################################################### Log Out
@app.route("/logOut", methods=["GET", "POST"])
@pageGuard("logOut")
def logOut():
    if request.method == "GET": return render_template("index.html", **globals())


    elif request.method == "POST":
        # unknownError
        if request.form["for"] != "logOut": return response(type="warning", message="unknownError")

        # Remove User From Session
        session.pop('user')


        # Redirect To Home
        return response(
            type="success",
            message="success",
            deleteSessionUser=True,
            redirect="home",
            domChange=["menu"]
        )
