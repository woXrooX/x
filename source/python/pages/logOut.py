# Flask
from __main__ import app, request, render_template, make_response

# Utils
from __main__ import json

# Home Made
from __main__ import conf, pageGuard, session


#################################################### Log Out
@app.route("/logOut", methods=["GET", "POST"])
@pageGuard("logOut")
def logOut():
    if request.method == "GET": return render_template("index.html", **globals())


    elif request.method == "POST":

        # Remove User From Session
        session.pop('user')

        # Reset Site Language To The Default
        global langCode
        langCode = conf["default"]["language"]

        # Redirect To Home
        return make_response(json.dumps({
            "type": "success",
            "message": "success",
            "actions": {
                "deleteSessionUser": 0,
                "redirect": {
                    "url": "home"
                },
                "domChange": {
                    "section": "menu"
                }
            }
        }), 200)
