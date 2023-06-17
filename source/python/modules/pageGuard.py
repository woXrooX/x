if __name__ != "__main__":
    import json
    from functools import wraps # For pageGuard() Wrapper
    from main import redirect, render_template, request, url_for, session
    from python.modules.Globals import Globals
    from python.modules.MySQL import MySQL
    from python.modules.Logger import Log

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
                # Log.line()
                # Log.center("pageGuard START", '-')
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
                #
                # print("\n----- page")
                # print(page)
                # Log.center("pageGuard END", '-')
                # Log.line()

                ##################### POST
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


                ##################### GET

                ####### App Is Down
                if "appIsDown" in Globals.CONF["default"]:
                    return render_template("index.html", **globals())


                # Check If Page Exists In CONF["pages"]
                if page not in Globals.CONF["pages"]: return redirect(url_for("home"))


                # Is Page Enabled
                if Globals.CONF["pages"][page]["enabled"] == False: return redirect(url_for("home"))


                # Everyone
                if(
                    "authenticity_statuses" not in Globals.CONF["pages"][page] and
                    "roles" not in Globals.CONF["pages"][page] and
                    "plans" not in Globals.CONF["pages"][page]
                ): return func(*args, **kwargs)


                # Session Dependent Checks
                if "user" in session:
                    # Root
                    if "root" in session["user"]["roles"]: return func(*args, **kwargs)


                    #### Authenticity Statuses
                    authenticity_check = False
                    if "authenticity_statuses" in Globals.CONF["pages"][page]:
                        for user_authenticity_status in Globals.USER_AUTHENTICITY_STATUSES:
                            if(
                                session["user"]["authenticity_status"] == Globals.USER_AUTHENTICITY_STATUSES[user_authenticity_status]["id"] and
                                user_authenticity_status in Globals.CONF["pages"][page]["authenticity_statuses"]
                            ):
                                authenticity_check = True

                    else: authenticity_check = True


                    #### Roles
                    role_check = False
                    if "roles" in Globals.CONF["pages"][page]:

                        # Check If One Of The User Assigned Rules Match With The CONF[page]["roles"]
                        if any(role in Globals.CONF["pages"][page]["roles"] for role in session["user"]["roles"]):
                            role_check = True

                    else: role_check = True


                    #### Plans - similar to role check
                    plan_check = True # Should be false in actual implementation


                    #### Final Check: IF All Checks Passed
                    if(
                        authenticity_check is True and
                        role_check is True and
                        plan_check is True
                    ): return func(*args, **kwargs)


                # Session Independent Checks
                if "user" not in session:

                    #### Authenticity Statuses
                    authenticity_check = False
                    if(
                        "authenticity_statuses" not in Globals.CONF["pages"][page] or
                        "authenticity_statuses" in Globals.CONF["pages"][page] and
                        "unauthenticated" in Globals.CONF["pages"][page]["authenticity_statuses"]
                    ): authenticity_check = True

                    #### Roles
                    role_check = False
                    if "roles" not in Globals.CONF["pages"][page]: role_check = True

                    #### Plans
                    plan_check = False
                    if "plans" not in Globals.CONF["pages"][page]: plan_check = True

                    #### Final Check: IF All Checks Passed
                    if(
                        authenticity_check is True and
                        role_check is True and
                        plan_check is True
                    ): return func(*args, **kwargs)

                # Failed The Guard Checks
                return redirect(url_for("home"))

            return wrapper

        return decorator