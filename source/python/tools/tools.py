from functools import wraps # For pageGuard() Wrapper

from __main__ import CONF, session

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
            # Check If Page Exists
            if page not in CONF["pages"]: return redirect(url_for("home"))

            # Is Page Enabled
            if CONF["pages"][page]["enabled"] == False: return redirect(url_for("home"))

            # Looping Through Page's Allowed List
            for allowed in CONF["pages"][page]["allowed"]:
                # Only Allowed "unauthenticated" Users
                if allowed == "unauthenticated" and "user" in session: return redirect(url_for("home"))

                # Only Allowed "unauthorized" Users
                if allowed == "unauthorized" and "user" not in session: return redirect(url_for("home"))

                # Only Allowed "authorized" Users
                # Retrive authorized_type_id From Database
                # authorized_type_id = 5
                # if allowed == "authorized":
                #     if "user" not in session or "user" in session and session["user"]["type"] != authorized_type_id:
                #         return redirect(url_for("home"))

            return func(*args, **kwargs)

        return wrapper

    return decorator

######################################### Sanitized Session For Front
def publicSessionUser():
    # Check If User In Session
    if "user" not in session: return None

    publicData = {
        "username": session["user"]["username"],
        "firstname": session["user"]["firstname"],
        "lastname": session["user"]["lastname"]
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
