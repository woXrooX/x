if __name__ != "__main__":
    import pathlib # X_RUNNING_FROM
    import os # PROJECT_RUNNING_FROM
    import main # X_RUNNING_FROM

    from main import session
    from python.modules.MySQL import MySQL

    class Globals():
        #### Paths
        X_RUNNING_FROM = pathlib.Path(main.__file__).parent.absolute()

        # Go Back Two Times From "X_RUNNING_FROM"
        PROJECT_RUNNING_FROM = os.path.abspath(os.path.join(X_RUNNING_FROM, '../..'))

        #### X
        CONF = {}
        LANG_DICT = {}
        USER_AUTHENTICITY_STATUSES = {}
        USER_ROLES = {}

        BUILT_IN_FILES = {
            "pages": {
                "back": [
                    "__init__.py",
                    "api.py",
                    "app_is_down.py",
                    "eMailConfirmation.py",
                    "logIn.py",
                    "logOut.py",
                    "logOutInstant.py",
                    "pageNotFound.py",
                    "signUp.py"
                ],
                "front": [
                    "appIsDown.js",
                    "eMailConfirmation.js",
                    "logIn.js",
                    "logOut.js",
                    "logOutInstant.js",
                    "pageNotFound.js",
                    "signUp.js"
                ]
            }
        }

        #### Project
        PROJECT = {}
        PROJECT_CSS = None
        PROJECT_SVG = {}
        PROJECT_LANG_DICT = {}

        #### Mix
        PUBLIC_CONF = {}

        @staticmethod
        def getUserAuthenticityStatuses():
            data = MySQL.execute("SELECT * FROM user_authenticity_statuses")

            if data is False:
                print("------------- FileSystem -------------")
                print("Could Not Fetch 'user_authenticity_statuses'")
                print("--------------------------------------")
                return

            for user_authenticity_status in data:
                Globals.USER_AUTHENTICITY_STATUSES[user_authenticity_status["name"]] = user_authenticity_status

        @staticmethod
        def getUserRoles():
            data = MySQL.execute("SELECT * FROM user_roles")

            if data is False:
                print("------------- FileSystem -------------")
                print("Could Not Fetch 'user_roles'")
                print("--------------------------------------")
                return

            # Making USER_ROLES accessible by keyword like "root" or "dev"
            for user_role in data:
                Globals.USER_ROLES[user_role["name"]] = user_role

        @staticmethod
        def getUserAssignedRoles():
            if "user" in session:
                data = MySQL.execute(
                    sql="""
                        SELECT user_roles.name
                        FROM user_roles
                        RIGHT JOIN users_roles
                        ON user_roles.id = users_roles.role AND users_roles.user = %s;
                    """,
                    params=(session["user"]["id"],)
                )

                session["user"]["roles"] = []

                if data is False:
                    print("------------- FileSystem -------------")
                    print("Could Not Fetch 'user_roles'")
                    print("--------------------------------------")
                    return

                # Extracting IDs From Response
                for role in data: session["user"]["roles"].append(role["name"])
