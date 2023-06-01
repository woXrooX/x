if __name__ != "__main__":
    from main import session
    from python.modules.MySQL import MySQL
    from python.modules.Globals import Globals

    class User:
        @staticmethod
        def getAuthenticityStatuses():
            with MySQL(False) as db:
                db.execute("SELECT * FROM user_authenticity_statuses")
                dataFetched = db.fetchAll()

                # Making USER_AUTHENTICITY_STATUSES accessible by name
                for user_authenticity_status in dataFetched:
                    Globals.USER_AUTHENTICITY_STATUSES[user_authenticity_status["name"]] = user_authenticity_status

        @staticmethod
        def getRoles():
            with MySQL(False) as db:
                db.execute("SELECT * FROM user_roles")
                dataFetched = db.fetchAll()

                # Making USER_TYPES accessible by keyword like "root" or "dev"
                for user_role in dataFetched:
                    Globals.USER_ROLES[user_role["name"]] = user_role

        @staticmethod
        def getAssignedRoles():
            if "user" not in session: return False

            with MySQL(False) as db:
                db.execute(
                    ("""
                        SELECT user_roles.name
                        FROM user_roles
                        INNER JOIN users_roles
                        ON user_roles.id = users_roles.role AND users_roles.user = %s
                    """),
                    (session["user"]["id"],)
                )

                session["user"]["roles"] = []

                # Extracting IDs From Response
                for role in db.fetchAll(): session["user"]["roles"].append(role["name"])

                return True

        @staticmethod
        def updateSession():
            # Check If User In Session | Error
            if "user" not in session: return False

            # Get User Data
            with MySQL(False) as db:
                db.execute(("SELECT * FROM users WHERE id=%s"), (session["user"]["id"], ))

                # Error
                if db.hasError():
                    return False

                session["user"] = db.fetchOne()

                # Handle The Error
                if not User.getAssignedRoles():
                    pass

            # Success
            return True

        # Sanitized Session Data For Front
        @staticmethod
        def generatePublicSession():
            # Check If User In Session
            if "user" not in session: return None

            publicData = {
                "id": session["user"]["id"],
                "username": session["user"]["username"],
                "firstname": session["user"]["firstname"],
                "lastname": session["user"]["lastname"],
                "app_color_mode": session["user"]["app_color_mode"],
                "authenticity_status": session["user"]["authenticity_status"],
                "roles": session["user"]["roles"],
            }

            return publicData
