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

        #### Project
        PROJECT = {}
        PROJECT_CSS = None
        PROJECT_SVG = {}
        PROJECT_LANG_DICT = {}

        #### Mix
        PUBLIC_CONF = {}

        @staticmethod
        def getUserAuthenticityStatuses():
            with MySQL(False) as db:
                db.execute("SELECT * FROM user_authenticity_statuses")
                dataFetched = db.fetchAll()

                # Making USER_AUTHENTICITY_STATUSES accessible by name
                for user_authenticity_status in dataFetched:
                    Globals.USER_AUTHENTICITY_STATUSES[user_authenticity_status["name"]] = user_authenticity_status

        @staticmethod
        def getUserRoles():
            with MySQL(False) as db:
                db.execute("SELECT * FROM user_roles")
                dataFetched = db.fetchAll()

                # Making USER_TYPES accessible by keyword like "root" or "dev"
                for user_role in dataFetched:
                    Globals.USER_ROLES[user_role["name"]] = user_role

        @staticmethod
        def getUserAssignedRoles():
            if "user" in session:
                with MySQL(False) as db:
                    db.execute(
                        ("""
                            SELECT user_roles.name
                            FROM user_roles
                            RIGHT JOIN users_roles
                            ON user_roles.id = users_roles.role AND users_roles.user = %s
                        """),
                        (session["user"]["id"],)
                    )

                    session["user"]["roles"] = []

                    # Extracting IDs From Response
                    for role in db.fetchAll(): session["user"]["roles"].append(role["name"])
