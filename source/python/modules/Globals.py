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
		NOTIFICATION_EVENTS = {}

		BUILT_IN_FILES = {
			"modules":{
				"Python": [
					"Backup.py",
					"FileSystem.py",
					"Globals.py",
					"IP_address_tools.py",
					"Logger.py",
					"Log_In_Tools.py",
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
					"Twilio.py",
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
					"x_actions.py",
					"x_app_analytics.py",
					"x_feedback_leave.py",
					"x_feedback.py",
					"x_log_in_records.py",
					"x_notification.py",
					"x_notifications.py",
					"x_user.py",
					"x_users.py"
				]
			}
		}

		#### Project
		PROJECT = {}
		PROJECT_SVG = {}
		PROJECT_LANG_DICT = {}
		PROJECT_HTML = {}

		# Global empty data holder to be used by project
		PROJECT_DATA = {}

		#### Mix
		PUBLIC_CONF = {}

		#### Global data holder
		DATA = {}
