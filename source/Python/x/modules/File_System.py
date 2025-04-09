if __name__ != "__main__":
	import os
	import sys
	import shutil
	import json
	from main import session
	from Python.x.modules.Logger import Log
	from Python.x.modules.Globals import Globals

	class File_System:
		################# Helpers
		# Helpers with strict mode True will exit the script (Stop the server) on fail

		@staticmethod
		def create_folder(path, strict = False):
			try:
				Log.info(f"Folder: {path}")

				os.makedirs(f'{path}', mode=0o777, exist_ok=True)

				return True

			except:
				Log.error(f"Could Not Create The Folder: {path}")

				if strict is True: sys.exit()

				return False

		@staticmethod
		def create_file(path_name_extension, content = "", strict = False, overwrite = False):
			if os.path.exists(f"{path_name_extension}") and not overwrite:
				Log.info(f"File_System.create_file(): File already exists: {path_name_extension}")
				return

			try:
				Log.info(f"File: {path_name_extension}")

				with open(f'{path_name_extension}', 'w') as f:
					f.write(f"{content}")

				return True

			except Exception as e:
				Log.error(f"File_System.create_file(): Error: {e}")

				if strict is True: sys.exit()

				return False

		@staticmethod
		def copy_folder(source, destination, strict = False):
			try:
				Log.info(f"File_System.copy_folder(): Source: {source} | Destination: {destination}")

				shutil.copytree(source, destination, dirs_exist_ok=True)

				return True

			except:
				Log.error(f"File_System.copy_folder(): Could not copy the folder: {source}")

				if strict is True: sys.exit()

				return False

		@staticmethod
		def copy_file(from_path, to_path, file, strict = False):
			try:
				# shutil.copy vs shutil.copyfile
				# shutil.copyfile copies the contents of the source file to the destination file.
				# Metadata such as permissions, execution bits, and the file's timestamp are not copied.
				# Only the data inside the file is copied.
				shutil.copyfile(f"{from_path}/{file}", f"{to_path}/{file}")

				Log.info(f"File Copied: {file}")

				return True

			except:
				Log.error(f"Could Not Copy The File: {file}")

				if strict is True: sys.exit()

				return False

		# Will Copy All The Files In A Folder With A Given Extension
		@staticmethod
		def copy_files(from_path, to_path, extensions = [], strict = False):
			try:
				files = os.listdir(from_path)

				for file in files:
					# Check If Extension Passed Then Copy Files Only With That Given Extension
					if(
						extensions != [] and
						os.path.splitext(file)[1] not in extensions
					):
						Log.warning(f"Not Matching File Extension: {file}")
						continue

					File_System.copy_file(from_path, to_path, file, strict=True)

				Log.success(f"Files Are Copied To: {to_path}")

				return True

			except:
				Log.error(f"Could Not Copy The Files @: {from_path}")

				if strict is True: sys.exit()

				return False

		@staticmethod
		def delete_file(pathAndFile, strict = False):
			try:
				os.remove(f"{pathAndFile}")

				Log.success(f"File Deleted Successfully: {pathAndFile}")

				return True

			except:
				Log.error(f"Could Not Delete The Files @: {pathAndFile}")

				if strict is True: sys.exit()

				return False

		@staticmethod
		def remove_folder(path, strict = False):
			try:
				shutil.rmtree(path)

				Log.success(f"Folder removed successfully: {path}")

				return True

			except:
				Log.error(f"Could not remove the folder @: {path}")

				if strict is True: sys.exit()

				return False




		################# System
		# Initiate System Files And Folders
		@staticmethod
		def init():
			################################ Creating
			################ Folders
			Log.center("Creating folders", '=')

			# x/source/[folder]
			x_folders = [
				"project_files/assets", "project_files/assets/private", "project_files/assets/public", "project_files/users",
				"Python/project/modules",
				"www", "www/HTML", "www/static"
			]
			for folder in x_folders: File_System.create_folder(f'{Globals.X_RUNNING_FROM}/{folder}/', strict=True)

			# project/[folder]
			project_folders = [
				"Backups",
				"CSS",
				"files",
				"fonts",
				"HTML",
				"images",
				"JavaScript", "JavaScript/JSON", "JavaScript/libs", "JavaScript/modules",
				"pages", "pages/back", "pages/front",
				"Python",
				"SVG"
			]
			for folder in project_folders: File_System.create_folder(f'{Globals.PROJECT_RUNNING_FROM}/{folder}/', strict=True)



			################################ Clean up
			Log.center("Clean up", '=')

			Log.center("Pages (Back-End)", '-')
			File_System.clean_live_pages()

			Log.center("Python (Modules)", '-')
			File_System.clean_external_copied_Python_modules()

			Log.center("Removing: x/source/www", '-')
			File_System.remove_folder(f'{Globals.X_RUNNING_FROM}/www/')



			################ Files
			Log.center("Creating files", '=')
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/CSS/styles.css", strict=True)
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/HTML/head.html", strict=True)
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/HTML/body.html", strict=True)
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/JavaScript/modules/header.js", 'export default function header(){\n\treturn "Header";\n}', strict=True)
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/JavaScript/modules/footer.js", 'export default function footer(){\n\treturn Lang.use("powered_by_woXrooX");\n}', strict=True)
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/pages/back/home.py", 'from Python.x.modules.Page import Page\n\n@Page.build()\ndef home(): pass', strict=True)
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/pages/front/home.js", 'export function before(){ window.x.Head.set_title("home"); }\n\nexport default function main(){\n\treturn "Home";\n}', strict=True)
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/Python/before_first_request.py", 'if __name__ != "__main__":\n\tdef before_first_request(): pass')
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/Python/on_app_start.py", 'if __name__ != "__main__":\n\tdef init(): pass')
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/Python/on_sign_up.py", 'if __name__ != "__main__":\n\tdef on_sign_up(): pass')
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/Python/on_log_in.py", 'if __name__ != "__main__":\n\tdef on_log_in(): pass')
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/Python/on_log_out.py", 'if __name__ != "__main__":\n\tdef on_log_out(): pass')
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/language_dictionary.json", '{"x": {"en": "x"}}', strict=True)
			File_System.create_file(f"{Globals.PROJECT_RUNNING_FROM}/project.json", "{}", strict=True)


			################################ Loading/Reading Files
			Log.center("Loading files", '=')

			######### Internals
			# x.json
			File_System.load_internal_configurations()

			# language_dictionary.json
			File_System.load_internal_language_dictionary()

			######### Externals
			# project.json
			File_System.load_project_configurations()

			# HTML
			File_System.load_external_HTML()

			# SVG
			File_System.load_external_SVG()

			# language_dictionary.json
			File_System.load_external_language_dictionary()

			######### Merge
			# Merge Configurations
			File_System.merge_configurations()

			# Merge Configurations
			File_System.merge_language_dictionaries()


			################################ Copying "x" folders
			Log.center('Copying "x" folders', '=')
			File_System.copy_folder(f"{Globals.X_RUNNING_FROM}/CSS", f"{Globals.X_RUNNING_FROM}/www/static/CSS", strict=True)
			File_System.copy_folder(f"{Globals.X_RUNNING_FROM}/fonts", f"{Globals.X_RUNNING_FROM}/www/static/fonts", strict=True)
			File_System.copy_folder(f"{Globals.X_RUNNING_FROM}/HTML", f"{Globals.X_RUNNING_FROM}/www/HTML", strict=True)
			File_System.copy_folder(f"{Globals.X_RUNNING_FROM}/images", f"{Globals.X_RUNNING_FROM}/www/static/images", strict=True)
			File_System.copy_folder(f"{Globals.X_RUNNING_FROM}/JavaScript", f"{Globals.X_RUNNING_FROM}/www/static/JavaScript", strict=True)
			File_System.copy_folder(f"{Globals.X_RUNNING_FROM}/Python/x/pages", f"{Globals.X_RUNNING_FROM}/Python/live_pages", strict=True)

			################################ Copying "project" folders/files
			Log.center('Copying "project" folders', '=')
			File_System.copy_folder(f"{Globals.PROJECT_RUNNING_FROM}/CSS", f"{Globals.X_RUNNING_FROM}/www/static/CSS", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_RUNNING_FROM}/files", f"{Globals.X_RUNNING_FROM}/www/static/files", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_RUNNING_FROM}/fonts", f"{Globals.X_RUNNING_FROM}/www/static/fonts", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_RUNNING_FROM}/images", f"{Globals.X_RUNNING_FROM}/www/static/images", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_RUNNING_FROM}/JavaScript", f"{Globals.X_RUNNING_FROM}/www/static/JavaScript", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_RUNNING_FROM}/pages/back", f"{Globals.X_RUNNING_FROM}/Python/live_pages", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_RUNNING_FROM}/pages/front", f"{Globals.X_RUNNING_FROM}/www/static/JavaScript/pages", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_RUNNING_FROM}/Python", f"{Globals.X_RUNNING_FROM}/Python/project/modules", strict=True)

		################# Methods for File_system.init()
		####### CleanUp
		# Pages (Back-End)
		@staticmethod
		def clean_live_pages():
			path = f"{Globals.X_RUNNING_FROM}/Python/live_pages/"

			files = os.listdir(path)

			for file_name in files:
				# File name and path
				file_path = os.path.join(path, file_name)

				if os.path.isfile(file_path) and file_name != "__init__.py": File_System.delete_file(file_path, strict=True)


		# Python (Modules)
		@staticmethod
		def clean_external_copied_Python_modules():
			path = f"{Globals.X_RUNNING_FROM}/Python/project/modules/"

			files = os.listdir(path)

			for file_name in files:
				# File name and path
				file_path = os.path.join(path, file_name)

				if os.path.isfile(file_path): File_System.delete_file(file_path, strict=True)


		####### Load
		#### Internals
		# Configurations - x.json
		@staticmethod
		def load_internal_configurations():
			try:
				with open(f"{Globals.X_RUNNING_FROM}/x.json", 'r') as file:
					Globals.CONF = json.load(file)

				Log.success("Loaded: x.json")

			except Exception as err:
				Log.error(f"File_System.load_internal_configurations(): {err}")
				sys.exit()

		@staticmethod
		def load_internal_language_dictionary():
			try:
				with open(f'{Globals.X_RUNNING_FROM}/language_dictionary.json', encoding="utf8") as file:
					Globals.LANG_DICT = json.load(file)

				Log.success("Internal language_dictionary.json Is Loaded")

			except:
				Log.error("Could Not Read The Internal language_dictionary.json")


		#### Externals
		# Project Configurations - project.json
		@staticmethod
		def load_project_configurations():
			try:
				with open(f"{Globals.PROJECT_RUNNING_FROM}/project.json", 'r') as file:
					Globals.PROJECT = json.load(file)

				Log.success("Loaded: project.json")

			except:
				Log.error("Could Not Load The project.json")
				sys.exit()

		@staticmethod
		def load_external_HTML():
			for file in os.listdir(f'{Globals.PROJECT_RUNNING_FROM}/HTML'):
				# Check if file is a HTML file
				if not file.endswith(".html"): continue

				try:
					with open(f'{Globals.PROJECT_RUNNING_FROM}/HTML/{file}', "r") as HTML:
						Globals.PROJECT_HTML[os.path.splitext(file)[0]] = HTML.read()

					Log.success(f"HTML loaded: {file}")

				except: Log.warning(f"Could not load the HTML file: {file}")

		@staticmethod
		def load_external_SVG():
			for file in os.listdir(f'{Globals.PROJECT_RUNNING_FROM}/SVG'):
				# Check If File Is A SVG File
				if not file.endswith(".svg"): continue

				try:
					with open(f'{Globals.PROJECT_RUNNING_FROM}/SVG/{file}', "r") as svg:
						Globals.PROJECT_SVG[os.path.splitext(file)[0]] = svg.read()

					Log.success(f"SVG Loaded: {file}")

				except:
					Log.warning(f"Could Not Load The SVG: {file}")

		@staticmethod
		def load_external_language_dictionary():
			try:
				with open(f"{Globals.PROJECT_RUNNING_FROM}/language_dictionary.json", 'r') as file:
					Globals.PROJECT_LANG_DICT = json.load(file)

				Log.success("External language_dictionary.json Is Loaded")

			except:
				Log.error("Could Not Read The External language_dictionary.json")


		#### Merge
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

		@staticmethod
		def merge_language_dictionaries():
			# Override The LANG_DICT w/ The PROJECT_LANG_DICT
			Globals.LANG_DICT.update(Globals.PROJECT_LANG_DICT)
