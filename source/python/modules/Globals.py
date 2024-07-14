if __name__ != "__main__":
	import pathlib # X_RUNNING_FROM
	import os # PROJECT_RUNNING_FROM
	import main # X_RUNNING_FROM

	from python.modules.Logger import Log

	class Globals():
		#### Paths
		X_RUNNING_FROM = pathlib.Path(main.__file__).parent.absolute()

		# Go back two times from "X_RUNNING_FROM"
		PROJECT_RUNNING_FROM = os.path.abspath(os.path.join(X_RUNNING_FROM, '../..'))

		#### x
		CONF = {}
		LANG_DICT = {}
		LANGUAGES = {}
		USER_AUTHENTICITY_STATUSES = {}
		USER_ROLES = {}
		USER_OCCUPATIONS = {}
		NOTIFICATION_TYPES = {}

		BUILT_IN_FILES = {
			"modules":{
				"Python": [
					"Backup.py",
					"FileSystem.py",
					"Globals.py",
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
			},
			"pages": {
				"back": [
					"__init__.py",
					"api.py",
					"app_is_down.py",
					"eMail_confirmation.py",
					"error_handlers.py",
					"files_assets.py",
					"files_users.py",
					"log_in.py",
					"log_out.py",
					"log_out_instant.py",
					"request_password_recovery.py",
					"reset_password.py",
					"sign_up.py",
					"x_root.py",
					"x_notifications.py"
				]
			}
		}

		#### Project
		PROJECT = {}
		PROJECT_SVG = {}
		PROJECT_LANG_DICT = {}
		PROJECT_HTML = {}

		#### Mix
		PUBLIC_CONF = {}

		#### Global data holder
		DATA = {}
