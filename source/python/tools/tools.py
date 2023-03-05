from functools import wraps # For pageGuard() Wrapper

from __main__ import CONF, session, USER_TYPES, redirect, make_response, request, url_for, MySQL
import json

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
            print("\n\n----------------- pageGuard START -----------------")
            print("\n----- Request")
            print(request)
            print("\n----- Headers")
            print(request.headers)
            print("\n----- Method")
            print(request.method)
            print("\n----- Content Type")
            print(request.content_type)
            print("\n----- Form")
            print(request.form)
            print("\n----- Files")
            print(request.files)
            print("\n----- JSON")
            print(request.get_json)
            print("\n----------------- pageGuard END -----------------\n\n")

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

                ### "application/json"
                # Check If "for" In Request
                if request.content_type == "application/json" and "for" not in request.get_json():
                    return make_response(json.dumps({
                        "type": "warning",
                        "message": "unknownError"
                    }), 200)


                ### "multipart/form-data"
                # "multipart/form-data" will include boundary, which is not const value
                # That's why we need to extract "multipart/form-data" then compare it
                # Ex. "multipart/form-data; boundary=----WebKitFormBoundaryqZq6yAWEgk6aywYg"
                # Check If "for" In Request
                if "multipart/form-data" in request.content_type.split(';') and "for" not in request.form:
                    return make_response(json.dumps({
                        "type": "warning",
                        "message": "unknownError"
                    }), 200)

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
            # Check If Page Exists
            if page not in CONF["pages"]: return redirect(url_for("home"))


            # Is Page Enabled
            if CONF["pages"][page]["enabled"] == False: return redirect(url_for("home"))


            # Everyone
            if "everyone" in CONF["pages"][page]["allowed"]: return func(*args, **kwargs)


            # Session Dependent Checks
            if "user" in session:
                # Root
                if session["user"]["type"] == USER_TYPES["root"]["id"]: return func(*args, **kwargs)


                # If User Type Matches With One Of The Page's Allowed User Types
                for user_type in USER_TYPES:
                    if(
                        session["user"]["type"] == USER_TYPES[user_type]["id"] and
                        user_type in CONF["pages"][page]["allowed"]
                    ):
                        return func(*args, **kwargs)


            # Session Independent Checks
            if "user" not in session:

                # Unauthenticated User
                if "unauthenticated" in CONF["pages"][page]["allowed"]: return func(*args, **kwargs)


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
