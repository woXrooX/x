import json
from main import app, request, make_response, session
from python.modules.Globals import Globals
from python.modules.User import User



#################################################### Bridge
@app.route("/api", methods=["POST"])
def api():
    # initialData
    if request.get_json()["for"] == "initialData":
        return make_response(
            {
                "CONF": Globals.PUBLIC_CONF,
                "session": {"user": User.generatePublicSession()} if "user" in session else {},
                "LANG_CODE": Globals.CONF["default"]["language"],
                "LANG_DICT": Globals.LANG_DICT,
                "USER_AUTHENTICITY_STATUSES": Globals.USER_AUTHENTICITY_STATUSES,
                "USER_ROLES": Globals.USER_ROLES,
                "PROJECT_SVG": Globals.PROJECT_SVG
            }, 200)
