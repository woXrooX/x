if __name__ != "__main__":
	from main import session
	from python.modules.MySQL import MySQL
	from python.modules.Globals import Globals
	from python.modules.Logger import Log

	class User:
		@staticmethod
		def getAssignedRoles():
			if "user" not in session: return False

			data = MySQL.execute(
					sql="""
						SELECT user_roles.name
						FROM user_roles
						INNER JOIN users_roles
						ON user_roles.id = users_roles.role AND users_roles.user = %s
					""",
					params=(session["user"]["id"],)
				)

			session["user"]["roles"] = []

			# Extracting IDs From Response
			for role in data: session["user"]["roles"].append(role["name"])

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

		@staticmethod
		def updateSession():
			# Check If User In Session | Error
			if "user" not in session: return False

			# Get User Data
			data = MySQL.execute(
				sql="SELECT * FROM users WHERE id=%s LIMIT 1;",
				params=(session["user"]["id"],),
				fetchOne=True
			)

			# Error
			if data is False: return False

			session["user"] = data

			# Handle The Error
			if not User.getAssignedRoles(): pass

			# Success
			return True

		@staticmethod
		def setAppColorMode(color_mode):
			if "user" not in session: return False

			# Replace the [1, 2] with the data retrived from the database "app_color_modes"
			if color_mode not in [1, 2]: return False

			data = MySQL.execute(
				sql="UPDATE users SET app_color_mode=%s WHERE id=%s",
				params=(color_mode, session["user"]["id"]),
				commit=True
			)

			if data is False: return False

			Log.success("User.setAppColorMode(): App color mode updated.")

			# Not working if I try to update single key
			# session["user"]["app_color_mode"] = color_mode
			if User.updateSession() is False: pass

			return True
