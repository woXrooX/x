if __name__ != "__main__":
	import pathlib # X_RUNNING_FROM
	import os # PROJECT_RUNNING_FROM
	import main # X_RUNNING_FROM

	from python.modules.Logger import Log

	class Globals():
		#### Paths
		X_RUNNING_FROM = pathlib.Path(main.__file__).parent.absolute()

		# Go Back Two Times From "X_RUNNING_FROM"
		PROJECT_RUNNING_FROM = os.path.abspath(os.path.join(X_RUNNING_FROM, '../..'))

		#### X
		CONF = {}
		LANG_DICT = {}
		LANGUAGES = {}
		USER_AUTHENTICITY_STATUSES = {}
		USER_ROLES = {}
		USER_OCCUPATIONS = {}
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
					"signUp.py",
					"x_root.py"
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
