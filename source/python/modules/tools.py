from functools import wraps # For pageGuard() Wrapper
import json
from flask import redirect, render_template, request, url_for
from main import session, MySQL
from python.modules.Globals import Globals

######################################### Page Guard
"""
@wraps(func)

The functools.wraps function is a decorator used to preserve metadata of a decorated function,
such as the name, docstring, and argument signature, to the wrapped function.
When you use the functools.wraps decorator,
it takes the original function as an argument and returns a new function that has the same metadata as the original function.

"""

def pageGuard(page):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):

            # For Debugging
            # print("\n\n----------------- pageGuard START -----------------")
            # print("\n----- Request")
            # print(request)
            # print("\n----- Headers")
            # print(request.headers)
            # print("\n----- Method")
            # print(request.method)
            # print("\n----- Content Type")
            # print(request.content_type)
            # print("\n----- Form")
            # print(request.form)
            # print("\n----- Files")
            # print(request.files)
            # print("\n----- JSON")
            # print(request.get_json)
            # print("\n----------------- pageGuard END -----------------\n\n")

            ####### POST
            if request.method == "POST":
                # Check If "endpoint" In Request
                # if "endpoint" not in request.get_json():
                #     return make_response(json.dumps({
                #         "type": "warning",
                #         "message": "unknownError"
                #     }), 200)

                # Check If "endpoint" Is For This Page | Route
                # if "endpoint" in request.get_json() and request.get_json()["endpoint"] != page:
                #     return make_response(json.dumps({
                #         "type": "warning",
                #         "message": "unknownError"
                #     }), 200)

                ### App Is Down
                if "appIsDown" in Globals.CONF["default"]:
                    return response(type="warning", message="appIsDown")

                ### "application/json"
                # Check If "for" In Request
                if request.content_type == "application/json" and "for" not in request.get_json():
                    return response(type="warning", message="unknownError")


                ### "multipart/form-data"
                # "multipart/form-data" will include boundary, which is not const value
                # That's why we need to extract "multipart/form-data" then compare it
                # Ex. "multipart/form-data; boundary=----WebKitFormBoundaryqZq6yAWEgk6aywYg"
                # Check If "for" In Request
                if "multipart/form-data" in request.content_type.split(';') and "for" not in request.form:
                    return response(type="warning", message="unknownError")

                # if(
                #     # Form
                #     "for" not in request.form and
                #
                #     # JSON
                #     "for" not in request.get_json()
                # ):
                #     return make_response(json.dumps({
                #         "type": "warning",
                #         "message": "unknownError"
                #     }), 200)


            ####### GET

            ####### App Is Down
            if "appIsDown" in Globals.CONF["default"]:
                return render_template("index.html", **globals())


            # Check If Page Exists
            if page not in Globals.CONF["pages"]: return redirect(url_for("home"))


            # Is Page Enabled
            if Globals.CONF["pages"][page]["enabled"] == False: return redirect(url_for("home"))


            # Everyone
            if "everyone" in Globals.CONF["pages"][page]["allowed"]: return func(*args, **kwargs)


            # Session Dependent Checks
            if "user" in session:
                # Root
                if session["user"]["type"] == Globals.USER_TYPES["root"]["id"]: return func(*args, **kwargs)


                # If User Type Matches With One Of The Page's Allowed User Types
                for user_type in Globals.USER_TYPES:
                    if(
                        session["user"]["type"] == Globals.USER_TYPES[user_type]["id"] and
                        user_type in Globals.CONF["pages"][page]["allowed"]
                    ):
                        return func(*args, **kwargs)


            # Session Independent Checks
            if "user" not in session:

                # Unauthenticated User
                if "unauthenticated" in Globals.CONF["pages"][page]["allowed"]: return func(*args, **kwargs)


            # Failed The Guard Checks
            return redirect(url_for("home"))

        return wrapper

    return decorator

######################################### Update Session User
def updateSessionUser():
    # Check If User In Session | Error
    if "user" not in session: return False

    # Get User Data
    with MySQL(False) as db:
        db.execute(("SELECT * FROM users WHERE id=%s"), (session["user"]["id"], ))

        # Error
        if db.hasError():
            return False

        session["user"] = db.fetchOne()

        # Success
        return True


######################################### Sanitized Session For Front
def publicSessionUser():
    # Check If User In Session
    if "user" not in session: return None

    publicData = {
        "username": session["user"]["username"],
        "firstname": session["user"]["firstname"],
        "lastname": session["user"]["lastname"],
        "type": session["user"]["type"]
    }

    return publicData


# class C(object):
#     def __init__(self):
#         self._x = None
#
#     @property
#     def x(self):
#         """I'm the 'x' property."""
#         print("getter of x called")
#         return self._x
#
#     @x.setter
#     def x(self, value):
#         print("setter of x called")
#         self._x = value
#
#     @x.deleter
#     def x(self):
#         print("deleter of x called")
#         del self._x
#
#
# c = C()
# foo = c.x    # getter called
# c.x = 'foo'  # setter called
# del c.x      # deleter called