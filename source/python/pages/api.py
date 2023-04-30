import json
from main import app, request, make_response, session
from python.modules.tools import publicSessionUser
from python.modules.Globals import Globals



#################################################### Bridge
@app.route("/api", methods=["POST"])
def api():
    # initialData
    if request.get_json()["for"] == "initialData":
        return make_response(
            {
                "CONF": Globals.PUBLIC_CONF,
                "session": {"user": publicSessionUser()} if "user" in session else {},
                "LANG_CODE": Globals.CONF["default"]["language"],
                "LANG_DICT": Globals.LANG_DICT,
                "USER_AUTHENTICITY_STATUSES": Globals.USER_AUTHENTICITY_STATUSES,
                "USER_ROLES": Globals.USER_ROLES,
                "USER_ASSIGNED_ROLES": Globals.USER_ASSIGNED_ROLES,
                "PROJECT_SVG": Globals.PROJECT_SVG
            }, 200)
