if __name__ != "__main__":
	import pathlib # X_RUNNING_FROM
	import os # PROJECT_RUNNING_FROM
	import main # X_RUNNING_FROM

	from python.modules.MySQL import MySQL
	from python.modules.Logger import Log

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
		NOTIFICATION_TYPES = {}

		BUILT_IN_FILES = {
			"pages": {
				"back": [
					"__init__.py",
					"api.py",
					"app_is_down.py",
					"eMailConfirmation.py",
					"error_handlers.py",
					"files_assets.py",
					"files_users.py",
					"logIn.py",
					"logOut.py",
					"logOutInstant.py",
					"requestPasswordRecovery.py",
					"resetPassword.py",
					"signUp.py"
				]
			},
			"modules":{
				"Python": [
					"Backup.py",
					"FileSystem.py",
					"Globals.py",
					"GMail.py",
					"Logger.py",
					"LogInTools.py",
					"MongoDB.py",
					"MySQL.py",
					"Notifications.py",
					"OpenAI.py",
					"Page.py",
					"PDF.py",
					"Random.py",
					"response.py",
					"routeGuard.py",
					"SendGrid.py",
					"tools.py",
					"User.py"
				]
			}
		}

		#### Project
		PROJECT = {}
		PROJECT_SVG = {}
		PROJECT_LANG_DICT = {}

		#### Mix
		PUBLIC_CONF = {}

		#### Global data holder
		DATA = {}

		@staticmethod
		def getUserAuthenticityStatuses():
			data = MySQL.execute("SELECT * FROM user_authenticity_statuses")

			if data is False:
				Log.fieldset("Could Not Fetch 'user_authenticity_statuses'", "Globals.getUserAuthenticityStatuses()")
				return

			for user_authenticity_status in data:
				Globals.USER_AUTHENTICITY_STATUSES[user_authenticity_status["name"]] = user_authenticity_status

		@staticmethod
		def getUserRoles():
			data = MySQL.execute("SELECT * FROM user_roles")

			if data is False:
				Log.fieldset("Could Not Fetch 'user_roles'", "Globals.getUserRoles()")
				return

			# Making USER_ROLES accessible by keyword like "root" or "dev"
			for user_role in data:
				Globals.USER_ROLES[user_role["name"]] = user_role

		@staticmethod
		def getNotificationTypes():
			data = MySQL.execute("SELECT * FROM notification_types")

			if data is False:
				Log.fieldset("Could Not Fetch 'notification_types'", "Globals.getNotificationTypes()")
				return

			# Making NOTIFICATION_TYPES accessible by keyword like "success" or "error"
			for notification_type in data:
				Globals.NOTIFICATION_TYPES[notification_type["name"]] = notification_type
