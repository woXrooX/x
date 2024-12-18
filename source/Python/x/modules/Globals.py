if __name__ != "__main__":
	import pathlib # X_RUNNING_FROM
	import os # PROJECT_RUNNING_FROM
	import main # X_RUNNING_FROM

	from Python.x.modules.Logger import Log

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
