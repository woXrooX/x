# Flask
from __main__ import app, request, make_response

# Home Made
from __main__ import PUBLIC_CONF, langCode, langDict, session, publicSessionUser

import json



#################################################### Bridge
@app.route("/api", methods=["POST"])
def api():
    # globalData
    if request.get_json()["for"] == "globalData":
        return make_response(
            {
                "conf": PUBLIC_CONF,
                "session": {"user": publicSessionUser()} if "user" in session else {},
                "langCode": langCode,
                "langDict": langDict,
                # "languages":languages,
                # "currencies":currencies
            }, 200)

    # languages
    # if request.get_json()["for"] == "languages":
    #     return make_response(
    #         {
    #             "response":"ok",
    #             "languages":languages
    #         }, 200)

    # langCode
    if request.get_json()["for"] == "langCode":
        return make_response(
            {
                "response":"ok",
                "langCode":langCode
            }, 200)

    # langDict
    if request.get_json()["for"] == "langDict":
        return make_response(
            {
                "response":"ok",
                "langDict":langDict
            }, 200)
