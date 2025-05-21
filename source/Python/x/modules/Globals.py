if __name__ != "__main__":
	import pathlib # X_RUNNING_FROM
	import os # PROJECT_RUNNING_FROM
	import main # X_RUNNING_FROM

	from Python.x.modules.Logger import Log

	class Globals():
		#### Paths
		X_PATH = pathlib.Path(main.__file__).parent.absolute()

		# Go back two times from "X_RUNNING_FROM"
		PROJECT_PATH = os.path.abspath(os.path.join(X_PATH, '../..'))

		#### x
		CONF = {}
		LANG_DICT = {}

		CURRENCIES = {}
		LANGUAGES = {}
		USER_AUTHENTICITY_STATUSES = {}
		USER_ROLES = {}
		USER_OCCUPATIONS = {}
		NOTIFICATION_EVENTS = {}
		NOTIFICATION_TYPES = {}
		STRIPE_EVENT_TYPES = {}
		STRIPE_OBJECT_TYPES = {}

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
