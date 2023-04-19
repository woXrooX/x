import json

from main import app, request, make_response

from main import CONF, PROJECT_SVG, LANG_DICT, PUBLIC_CONF, session, USER_TYPES

from python.tools.tools import publicSessionUser



#################################################### Bridge
@app.route("/api", methods=["POST"])
def api():
    # initialData
    if request.get_json()["for"] == "initialData":
        return make_response(
            {
                "CONF": PUBLIC_CONF,
                "session": {"user": publicSessionUser()} if "user" in session else {},
                "LANG_CODE": CONF["default"]["language"],
                "LANG_DICT": LANG_DICT,
                "USER_TYPES": USER_TYPES,
                "PROJECT_SVG": PROJECT_SVG
            }, 200)
