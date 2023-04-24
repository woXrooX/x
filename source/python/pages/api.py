import json
from main import app, request, make_response
from main import session
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
                "USER_TYPES": Globals.USER_TYPES,
                "PROJECT_SVG": Globals.PROJECT_SVG
            }, 200)
