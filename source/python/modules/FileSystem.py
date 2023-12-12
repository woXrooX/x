if __name__ != "__main__":
	import os
	import sys
	import shutil
	import json
	import yaml
	from main import session
	from python.modules.Logger import Log
	from python.modules.Globals import Globals

	class FileSystem:
		################# Helpers
		# Helpers With Strict Mode True Will Exists The Script (Stop The Server) On Fail

		@staticmethod
		def createFolder(path, strict = True):
			try:
				Log.info(f"Folder: {path}")

				os.makedirs(f'{path}', mode=0o777, exist_ok=True)

				return True

			except:
				Log.error(f"Could Not Create The Folder: {path}")

				if strict is True: sys.exit()

				return False

		@staticmethod
		def createFile(pathNameExtension, content = "", strict = True):
			if not os.path.exists(f"{pathNameExtension}"):
				try:
					Log.info(f"File: {pathNameExtension}")

					with open(f'{pathNameExtension}', 'w') as f:
						f.write(f"{content}")

					return True

				except:
					Log.error(f"Could Not Create The File: {path}")

					if strict is True: sys.exit()

					return False

		@staticmethod
		def copyFile(fromPath, toPath, file, strict = True):
			try:
				shutil.copy(f"{fromPath}/{file}", toPath)

				Log.info(f"File Copied: {file}")

				return True

			except:
				Log.error(f"Could Not Copy The File: {file}")

				if strict is True: sys.exit()

				return False

		# Will Copy All The Files In A Folder With A Given Extension
		@staticmethod
		def copyFiles(fromPath, toPath, extensions = [], strict = True):
			try:
				files = os.listdir(fromPath)

				for file in files:
					# Check If Extension Passed Then Copy Files Only With That Given Extension
					if(
						extensions != [] and
						os.path.splitext(file)[1] not in extensions
					):
						Log.warning(f"Not Matching File Extension: {file}")
						continue

					FileSystem.copyFile(fromPath, toPath, file)

				Log.success(f"Files Are Copied To: {toPath}")

				return True

			except:
				Log.error(f"Could Not Copy The Files @: {fromPath}")

				if strict is True: sys.exit()

				return False

		@staticmethod
		def deleteFile(pathAndFile, strict = True):
			try:
				os.remove(f"{pathAndFile}")

				Log.success(f"File Deleted Successfully: {pathAndFile}")

				return True

			except:
				Log.error(f"Could Not Delete The Files @: {pathAndFile}")

				if strict is True: sys.exit()

				return False



		################# System
		# Initiate System Files And Folders
		@staticmethod
		def init():
			################################ CleanUp
			Log.center("Clean Up", '=')


			################ Pages (Back-End)
			Log.center("Pages (Back-End)", '-')
			FileSystem.cleanExternalCopiedPagesBack()

			################ Pages (Front-End)
			Log.center("Pages (Front-End)", '-')
			FileSystem.cleanExternalCopiedPagesFront()

			################ Python (Modules)
			Log.center("Python (Modules)", '-')
			FileSystem.cleanExternalCopiedPythonModules()

			################ JavaScript (Modules)
			Log.center("JavaScript (Modules)", '-')
			FileSystem.cleanExternalCopiedJavaScriptModules()


			################################ Creating
			################ Folders
			Log.center("Creating Folders", '=')

			## x/source/assets
			FileSystem.createFolder(f'{Globals.X_RUNNING_FROM}/assets/')

			project_folders = ["Backups", "CSS", "fonts", "images", "JS", "pages", "pages/back", "pages/front", "python", "SVG"]

			for folder in project_folders:
				FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/{folder}/')

			################ Files
			Log.center("Creating Files", '=')

			# styles.css
			FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/CSS/styles.css")

			# header.js
			FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/JS/header.js", 'export default function header(){\n\treturn "Header";\n}')

			# footer.js
			FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/JS/footer.js", 'export default function footer(){\n\treturn "Footer";\n}')

			# pages/back/home.py
			FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/pages/back/home.py", 'from python.modules.Page import Page\n\n@Page.build()\ndef home(): pass')

			# pages/front/home.js
			FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/pages/front/home.js", 'export const TITLE = window.Lang.use("home");\n\nexport default function content(){\n\treturn "Home";\n}')

			# languageDictionary.json
			FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/languageDictionary.json", '{"x": {"en": "x"}}')

			# project.json
			FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/project.json", "{}")


			################################ Loading/Reading Files
			Log.center("Loading Files", '=')

			######### Internals
			# config.yaml
			FileSystem.loadDefaultConfigurations()

			# Internal languageDictionary.json
			FileSystem.loadInternalLanguageDictionary()

			######### Externals
			# project.json
			FileSystem.loadProjectConfigurations()

			# CSS
			FileSystem.loadExternalCSS()

			# SVG
			FileSystem.loadExternalSVG()

			# External languageDictionary.json
			FileSystem.loadExternalLanguageDictionary()

			######### Merge
			# Merge Configurations
			FileSystem.mergeConfigurations()

			# Merge Configurations
			FileSystem.mergeLanguageDictionaries()


			################################ Copying
			Log.center("Copying Files", '=')

			## Fonts
			FileSystem.copyFonts()

			## Images
			FileSystem.copyImages()

			## JS
			FileSystem.copyJavaScripts()

			## Pages
			# Pages (Back-End)
			FileSystem.copyPagesBackEnd()

			# Pages (Front-End)
			FileSystem.copyPagesFrontEnd()

			## Pythons
			FileSystem.copyPythons()



		################# Methods for FileSystem.init()
		####### CleanUp
		# Pages (Back-End)
		@staticmethod
		def cleanExternalCopiedPagesBack():
			path = f"{Globals.X_RUNNING_FROM}/python/pages/"

			files = os.listdir(path)

			for file_name in files:
				# File name and path
				file_path = os.path.join(path, file_name)

				if os.path.isfile(file_path) and file_name not in Globals.BUILT_IN_FILES["pages"]["back"]:
					FileSystem.deleteFile(file_path)

		# Pages (Front-End)
		@staticmethod
		def cleanExternalCopiedPagesFront():
			path = f"{Globals.X_RUNNING_FROM}/js/pages/"

			files = os.listdir(path)

			for file_name in files:
				# File name and path
				file_path = os.path.join(path, file_name)

				if os.path.isfile(file_path) and file_name not in Globals.BUILT_IN_FILES["pages"]["front"]:
					FileSystem.deleteFile(file_path)

		# Python (Modules)
		@staticmethod
		def cleanExternalCopiedPythonModules():
			path = f"{Globals.X_RUNNING_FROM}/python/modules/"

			files = os.listdir(path)

			for file_name in files:
				# File name and path
				file_path = os.path.join(path, file_name)

				if os.path.isfile(file_path) and file_name not in Globals.BUILT_IN_FILES["modules"]["Python"]:
					FileSystem.deleteFile(file_path)

		# JavaScript (Modules)
		@staticmethod
		def cleanExternalCopiedJavaScriptModules():
			path = f"{Globals.X_RUNNING_FROM}/js/modules/"

			files = os.listdir(path)

			for file_name in files:
				# File name and path
				file_path = os.path.join(path, file_name)

				if os.path.isfile(file_path) and file_name not in Globals.BUILT_IN_FILES["modules"]["JavaScript"]:
					FileSystem.deleteFile(file_path)

		####### Copy
		# Copy Fonts
		@staticmethod
		def copyFonts():
			Log.center("Copying FONTS", '-')

			if FileSystem.copyFiles(f"{Globals.PROJECT_RUNNING_FROM}/fonts", f"{str(Globals.X_RUNNING_FROM)}/fonts") is True:
				Log.success("Fonts Are Copied")

			else: Log.error("Could Not Copy The Fonts")

		# Copy Images
		@staticmethod
		def copyImages():
			Log.center("Copying Images", '-')

			if FileSystem.copyFiles(f"{Globals.PROJECT_RUNNING_FROM}/images", f"{str(Globals.X_RUNNING_FROM)}/images", [".png", ".jpg", ".jpeg", ".gif"], False) is True:
				Log.success("Images Are Copied")

			else: Log.error("Could Not Copy The Fonts")

		# Copy JavaScripts
		@staticmethod
		def copyJavaScripts():
			Log.center("Copying JavaScripts", '-')

			if FileSystem.copyFiles(f"{Globals.PROJECT_RUNNING_FROM}/JS", f"{str(Globals.X_RUNNING_FROM)}/js/modules") is True:
				Log.success("JavaScripts Are Copied")

			else:
				Log.error("Could Not Copy The JavaScripts")
				sys.exit()

		# Copy Pages (Back-End)
		@staticmethod
		def copyPagesBackEnd():
			Log.center("Copying Pages (Back-End)", '-')

			if FileSystem.copyFiles(f"{Globals.PROJECT_RUNNING_FROM}/pages/back", f"{str(Globals.X_RUNNING_FROM)}/python/pages") is True:
				Log.success("Pages Are Copied (Back-End)")

			else:
				Log.error("Could Not Copy The Pages (Back-End)")
				sys.exit()

		# Copy Pages (Front-End)
		@staticmethod
		def copyPagesFrontEnd():
			Log.center("Copying Pages (Front-End)", '-')

			if FileSystem.copyFiles(f"{Globals.PROJECT_RUNNING_FROM}/pages/front", f"{str(Globals.X_RUNNING_FROM)}/js/pages") is True:
				Log.success("Pages Are Copied (Front-End)")

			else:
				Log.error("Could Not Copy The Pages (Front-End)")
				sys.exit()

		# Copy Pythons (Care! Pythons inside your folders xD)
		@staticmethod
		def copyPythons():
			Log.center("Copying Pythons", '-')

			if FileSystem.copyFiles(f"{Globals.PROJECT_RUNNING_FROM}/python", f"{str(Globals.X_RUNNING_FROM)}/python/modules") is True:
				Log.success("Pythons Are Copied")

			else:
				Log.error("Could Not Copy The Pythons")
				sys.exit()

		####### Load
		#### Internals
		# Configurations - config.yaml
		@staticmethod
		def loadDefaultConfigurations():
			try:
				with open(f"{Globals.X_RUNNING_FROM}/yaml/config.yaml", 'r') as file:
					Globals.CONF = yaml.safe_load(file)

				Log.success("Loaded: config.yaml")

			except:
				Log.error("Could Not Load The config.yaml")
				sys.exit()

		# Language Dictionary
		@staticmethod
		def loadInternalLanguageDictionary():
			try:
				with open(f'{Globals.X_RUNNING_FROM}/json/languageDictionary.json', encoding="utf8") as file:
					Globals.LANG_DICT = json.load(file)

				Log.success("Internal languageDictionary.json Is Loaded")

			except:
				Log.error("Could Not Read The Internal languageDictionary.json")

		#### Externals
		# Project Configurations - project.json
		@staticmethod
		def loadProjectConfigurations():
			try:
				with open(f"{Globals.PROJECT_RUNNING_FROM}/project.json", 'r') as file:
					Globals.PROJECT = json.load(file)

				Log.success("Loaded: project.json")

			except:
				Log.error("Could Not Load The project.json")
				sys.exit()

		# Load External CSS
		@staticmethod
		def loadExternalCSS():
			try:
				with open(f'{Globals.PROJECT_RUNNING_FROM}/CSS/styles.css', "r") as css:
					Globals.PROJECT_CSS = css.read()

				Log.success("External CSS Files Are Loaded")

			except:
				Log.warning("Could Not Read The External CSS")

		# Load External SVG
		@staticmethod
		def loadExternalSVG():
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
		def loadExternalLanguageDictionary():
			try:
				with open(f"{Globals.PROJECT_RUNNING_FROM}/languageDictionary.json", 'r') as file:
					Globals.PROJECT_LANG_DICT = json.load(file)

				Log.success("External languageDictionary.json Is Loaded")

			except:
				Log.error("Could Not Read The External languageDictionary.json")


		#### Merge
		# Merge config.yaml And project.json
		# Merge Project Dependent Configurations To Default Configurations. Override Defaults
		@staticmethod
		def mergeConfigurations():
			#### Merge
			# Database
			if "database" in Globals.PROJECT: Globals.CONF["database"] = Globals.PROJECT["database"]

			# eMail
			if "eMail" in Globals.PROJECT: Globals.CONF["eMail"].update(Globals.PROJECT["eMail"])

			# Defaults
			if "default" in Globals.PROJECT: Globals.CONF["default"].update(Globals.PROJECT["default"])

			# Pages
			if "pages" in Globals.PROJECT: Globals.CONF["pages"] = Globals.PROJECT["pages"]

			# Menu
			if "menu" in Globals.PROJECT: Globals.CONF["menu"] = Globals.PROJECT["menu"]

			# OpenAI
			if "OpenAI" in Globals.PROJECT: Globals.CONF["OpenAI"] = Globals.PROJECT["OpenAI"]

			#### Public Configurations
			Globals.PUBLIC_CONF["default"] = Globals.CONF["default"]
			Globals.PUBLIC_CONF["menu"] = Globals.CONF["menu"]
			Globals.PUBLIC_CONF["pages"] = Globals.CONF["pages"]
			Globals.PUBLIC_CONF["username"] = Globals.CONF["username"]
			Globals.PUBLIC_CONF["password"] = Globals.CONF["password"]
			Globals.PUBLIC_CONF["phoneNumber"] = Globals.CONF["phoneNumber"]

		@staticmethod
		def mergeLanguageDictionaries():
			# Override The LANG_DICT w/ The PROJECT_LANG_DICT
			Globals.LANG_DICT.update(Globals.PROJECT_LANG_DICT)
