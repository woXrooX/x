if __name__ != "__main__":
	import pathlib
	import os
	import json
	import sys

	import main

	from Python.x.modules.Logger import Log
	from Python.x.modules.File_System import File_System

	class Globals():
		#### Paths
		X_PATH = pathlib.Path(main.__file__).parent.absolute()

		# Go back two times from "X_RUNNING_FROM"
		PROJECT_PATH = os.path.abspath(os.path.join(X_PATH, '../..'))



		#### x
		CONF = {}

		LANGUAGE_DICTIONARY = {}

		CURRENCIES = {}

		LANGUAGES = {}

		USER_AUTHENTICITY_STATUSES = {}
		USER_ROLES = {}
		USER_OCCUPATIONS = {}

		CRON_JOB_EVENTS = {}

		NOTIFICATION_EVENTS = {}
		NOTIFICATION_TYPES = {}

		STRIPE_EVENT_TYPES = {}
		STRIPE_OBJECT_TYPES = {}



		#### Project
		PROJECT = {}
		PROJECT_SVG = {}
		PROJECT_LANGUAGE_DICTIONARY = {}
		PROJECT_HTML = {}

		# Global empty data holder to be used by project
		PROJECT_DATA = {}

		#### Mix
		PUBLIC_CONF = {}

		#### Global data holder
		DATA = {}


		################# CONF
		@staticmethod
		def init_CONF():
			Globals.load_internal_configurations()
			Globals.load_project_configurations()
			Globals.merge_configurations()

		# x configurations - x.json
		@staticmethod
		def load_internal_configurations():
			try:
				with open(f"{Globals.X_PATH}/x.json", 'r') as file:
					Globals.CONF = json.load(file)

				Log.success("Loaded: x.json")

			except Exception as err:
				Log.error(f"File_System.load_internal_configurations(): {err}")
				sys.exit()

		# Project configurations - project.json
		@staticmethod
		def load_project_configurations():
			try:
				File_System.create_file(f"{Globals.PROJECT_PATH}/project.json", "{}", strict=True)

				with open(f"{Globals.PROJECT_PATH}/project.json", 'r') as file:
					Globals.PROJECT = json.load(file)

				Log.success("Loaded: project.json")

			except:
				Log.error("Could Not Load The project.json")
				sys.exit()

		# Merge x.json and project.json
		# Merge project dependent configurations to default configurations. Override defaults
		@staticmethod
		def merge_configurations():
			#### Merge
			if "project_name" in Globals.PROJECT: Globals.CONF["project_name"] = Globals.PROJECT["project_name"]

			if "Twilio" in Globals.PROJECT: Globals.CONF["Twilio"] = Globals.PROJECT["Twilio"]

			if "Stripe" in Globals.PROJECT: Globals.CONF["Stripe"] = Globals.PROJECT["Stripe"]

			if "database" in Globals.PROJECT: Globals.CONF["database"] = Globals.PROJECT["database"]

			if "eMail" in Globals.PROJECT: Globals.CONF["eMail"].update(Globals.PROJECT["eMail"])

			if "password" in Globals.PROJECT: Globals.CONF["password"].update(Globals.PROJECT["password"])

			if "default" in Globals.PROJECT: Globals.CONF["default"].update(Globals.PROJECT["default"])

			if "tools" in Globals.PROJECT: Globals.CONF["tools"] = Globals.PROJECT["tools"]

			if "pages" in Globals.PROJECT: Globals.CONF["pages"] = Globals.PROJECT["pages"]

			if "menu" in Globals.PROJECT: Globals.CONF["menu"] = Globals.PROJECT["menu"]

			#### Public Configurations
			Globals.PUBLIC_CONF["project_name"] = Globals.CONF["project_name"]
			Globals.PUBLIC_CONF["default"] = Globals.CONF["default"]
			Globals.PUBLIC_CONF["tools"] = Globals.CONF["tools"]
			Globals.PUBLIC_CONF["pages"] = Globals.CONF["pages"]
			Globals.PUBLIC_CONF["menu"] = Globals.CONF["menu"]
			Globals.PUBLIC_CONF["username"] = Globals.CONF["username"]
			Globals.PUBLIC_CONF["password"] = Globals.CONF["password"]
			Globals.PUBLIC_CONF["phone_number"] = Globals.CONF["phone_number"]

			# print(json.dumps(Globals.PUBLIC_CONF, indent=4))


		################# LANGUAGE_DICTIONARY
		@staticmethod
		def init_LANGUAGE_DICTIONARY():
			Globals.load_x_LANGUAGE_DICTIONARY()
			Globals.load_PROJECT_LANGUAGE_DICTIONARY()
			Globals.merge_language_dictionaries()

		@staticmethod
		def load_x_LANGUAGE_DICTIONARY():
			try:
				with open(f'{Globals.X_PATH}/language_dictionary.json', encoding="utf8") as file:
					Globals.LANGUAGE_DICTIONARY = json.load(file)

				Log.success("Internal language_dictionary.json Is Loaded")

			except:
				Log.error("Could Not Read The Internal language_dictionary.json")

		@staticmethod
		def load_PROJECT_LANGUAGE_DICTIONARY():
			try:
				File_System.create_file(f"{Globals.PROJECT_PATH}/language_dictionary.json", '{"x": {"en": "x"}}', strict=True)

				with open(f"{Globals.PROJECT_PATH}/language_dictionary.json", 'r') as file:
					Globals.PROJECT_LANGUAGE_DICTIONARY = json.load(file)

				Log.success("External language_dictionary.json Is Loaded")

			except:
				Log.error("Could Not Read The External language_dictionary.json")

		# Override The LANGUAGE_DICTIONARY w/ The PROJECT_LANGUAGE_DICTIONARY
		@staticmethod
		def merge_language_dictionaries():
			Globals.LANGUAGE_DICTIONARY.update(Globals.PROJECT_LANGUAGE_DICTIONARY)

