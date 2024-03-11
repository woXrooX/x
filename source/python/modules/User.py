if __name__ != "__main__":
	import os
	import shutil

	from main import session
	from python.modules.MySQL import MySQL
	from python.modules.Globals import Globals
	from python.modules.Logger import Log

	class User:
		# NOTE: Designed for use as a decorator
		# If user is not in session, returns False
		@staticmethod
		def checkIfUserInSession(func):
			def wrapper(*args, **kwargs):
				if "user" not in session: return False
				return func(*args, **kwargs)
			return wrapper

		@staticmethod
		@checkIfUserInSession
		def getRoles():
			data = MySQL.execute(
					sql="""
						SELECT user_roles.name
						FROM user_roles
						INNER JOIN users_roles
						ON user_roles.id = users_roles.role AND users_roles.user = %s
					""",
					params=(session["user"]["id"],)
				)

			if data is False: return False

			session["user"]["roles"] = []

			# Extracting IDs From Response
			for role in data: session["user"]["roles"].append(role["name"])

			return True

		@staticmethod
		@checkIfUserInSession
		def getPlan():
			data = MySQL.execute(
				"SELECT user_plans.name FROM user_plans WHERE id = %s LIMIT 1;",
				(session["user"]["plan"],),
				fetchOne=True
			)

			if data is False: return False

			if data is None: session["user"]["plan"] = None
			else: session["user"]["plan"] = data["name"]

			return True


		# Sanitized Session Data For Front
		@staticmethod
		@checkIfUserInSession
		def generatePublicSession():
			return {
				"id": session["user"]["id"],
				"username": session["user"]["username"],
				"firstname": session["user"]["firstname"],
				"lastname": session["user"]["lastname"],
				"app_color_mode": session["user"]["app_color_mode"],
				"authenticity_status": session["user"]["authenticity_status"],
				"roles": session["user"]["roles"],
				"plan": session["user"]["plan"],
			}

		@staticmethod
		@checkIfUserInSession
		def updateSession():
			# Get User Data
			data = MySQL.execute(
				sql="SELECT * FROM users WHERE id=%s LIMIT 1;",
				params=(session["user"]["id"],),
				fetchOne=True
			)

			# Error
			if data is False: return False

			session["user"] = data

			if not User.getRoles(): pass

			if not User.getPlan(): pass

			# Success
			return True

		@staticmethod
		@checkIfUserInSession
		def setAppColorMode(color_mode):
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

		@staticmethod
		def initFolders(id = None):
			ID = None

			if id is not None:
				if isinstance(id, int) and id > 0: ID = id
				else:
					Log.warning(f"Invalid argument passed to the method @ user.initFolders(): {id}. Due to invalid ID, could not initiate user folders.")

					return False

			elif "user" in session: ID = session["user"]["id"]

			else: return False


			# Must match w/ the path in .gitignore
			# source/users/...
			path = f'{Globals.X_RUNNING_FROM}/users/{ID}/'

			# Try to create user folders
			try:
				# ID
				os.makedirs(f'{path}', mode=0o777, exist_ok=True)
				os.makedirs(f'{path}private', mode=0o777, exist_ok=True)
				os.makedirs(f'{path}public', mode=0o777, exist_ok=True)

				# Files (For all kinds of files. For example: .zip or .exe ...)
				# Documents (All kinds of files used as a document. For example it can be .png file but the image contex is some kind certificate)
				folders = ["images", "videos", "audios", "files", "documents"]

				for folder in folders:
					os.makedirs(f'{path}private/{folder}', mode=0o777, exist_ok=True)
					os.makedirs(f'{path}public/{folder}', mode=0o777, exist_ok=True)


				Log.success(f"User folders created @: {path}")

				return True

			except:
				Log.error(f"Could not create user folder(s) @: {path}")

				return False

		@staticmethod
		def deleteFiles(id):
			try:
				shutil.rmtree(f'{Globals.X_RUNNING_FROM}/users/{id}/')

				Log.success(f"User files deleted. User ID: {id}")

				return True

			except:
				Log.error(f"Could not delete user files. User ID: {id}")

				return False
