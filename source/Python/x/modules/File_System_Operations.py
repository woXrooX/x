if __name__ != "__main__":
	import os
	import sys
	import shutil
	import json

	from Python.x.modules.Logger import Log
	from Python.x.modules.Globals import Globals
	from Python.x.modules.File_System import File_System

	class File_System_Operations:
		################################ APIs

		# Initiate system files and folders
		@staticmethod
		def init():
			################################ Creating folders
			Log.center("Creating folders", '=')

			# x/source/[folder]
			x_folders = [
				"Python/project/modules",
				"www", "www/HTML", "www/static"
			]
			for folder in x_folders: File_System.create_folder(f'{Globals.X_PATH}/{folder}/', strict=True)

			# project/[folder]
			project_folders = [
				"CSS",
				"Files", "Files/assets", "Files/assets/private", "Files/assets/public", "Files/static", "Files/users",
				"fonts",
				"HTML",
				"images",
				"JavaScript", "JavaScript/JSON", "JavaScript/libs", "JavaScript/modules",
				"pages", "pages/back", "pages/front",
				"Python",
				"SVG"
			]
			for folder in project_folders: File_System.create_folder(f'{Globals.PROJECT_PATH}/{folder}/', strict=True)




			################################ Clean up
			Log.center("Clean up", '=')

			Log.center("Pages (Back-End)", '-')
			File_System_Operations.clean_live_pages()

			Log.center("Python (Modules)", '-')
			File_System_Operations.clean_external_copied_Python_modules()

			Log.center("Removing: x/source/www", '-')
			File_System.remove_folder(f'{Globals.X_PATH}/www/')




			################################ Creating files
			Log.center("Creating files", '=')
			File_System.create_file(f"{Globals.PROJECT_PATH}/CSS/styles.css", strict=True)
			File_System.create_file(f"{Globals.PROJECT_PATH}/HTML/head.html", strict=True)
			File_System.create_file(f"{Globals.PROJECT_PATH}/HTML/body.html", strict=True)
			File_System.create_file(f"{Globals.PROJECT_PATH}/JavaScript/modules/header.js", 'export default function header(){\n\treturn "Header";\n}', strict=True)
			File_System.create_file(f"{Globals.PROJECT_PATH}/JavaScript/modules/footer.js", 'export default function footer(){\n\treturn Lang.use("powered_by_woXrooX");\n}', strict=True)
			File_System.create_file(f"{Globals.PROJECT_PATH}/Python/before_first_request.py", 'if __name__ != "__main__":\n\tdef before_first_request(): pass')
			File_System.create_file(f"{Globals.PROJECT_PATH}/Python/on_app_start.py", 'if __name__ != "__main__":\n\tdef init(): pass')
			File_System.create_file(f"{Globals.PROJECT_PATH}/Python/on_sign_up.py", 'if __name__ != "__main__":\n\tdef on_sign_up(): pass')
			File_System.create_file(f"{Globals.PROJECT_PATH}/Python/on_log_in.py", 'if __name__ != "__main__":\n\tdef on_log_in(): pass')
			File_System.create_file(f"{Globals.PROJECT_PATH}/Python/on_log_out.py", 'if __name__ != "__main__":\n\tdef on_log_out(): pass')




			################################ Loading/Reading files
			Log.center("Loading files", '=')

			# HTML
			File_System_Operations.load_external_HTML()

			# SVG
			File_System_Operations.load_external_SVG()




			################################ Copying "x" folders
			Log.center('Copying "x" folders', '=')
			File_System.copy_folder(f"{Globals.X_PATH}/CSS", f"{Globals.X_PATH}/www/static/CSS", strict=True)
			File_System.copy_folder(f"{Globals.X_PATH}/fonts", f"{Globals.X_PATH}/www/static/fonts", strict=True)
			File_System.copy_folder(f"{Globals.X_PATH}/HTML", f"{Globals.X_PATH}/www/HTML", strict=True)
			File_System.copy_folder(f"{Globals.X_PATH}/images", f"{Globals.X_PATH}/www/static/images", strict=True)
			File_System.copy_folder(f"{Globals.X_PATH}/JavaScript", f"{Globals.X_PATH}/www/static/JavaScript", strict=True)
			File_System.copy_folder(f"{Globals.X_PATH}/Python/x/pages", f"{Globals.X_PATH}/Python/live_pages", strict=True)




			################################ Copying "project" folders/files
			Log.center('Copying "project" folders', '=')
			File_System.copy_folder(f"{Globals.PROJECT_PATH}/CSS", f"{Globals.X_PATH}/www/static/CSS", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_PATH}/Files/static", f"{Globals.X_PATH}/www/static/static", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_PATH}/fonts", f"{Globals.X_PATH}/www/static/fonts", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_PATH}/images", f"{Globals.X_PATH}/www/static/images", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_PATH}/JavaScript", f"{Globals.X_PATH}/www/static/JavaScript", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_PATH}/pages/back", f"{Globals.X_PATH}/Python/live_pages", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_PATH}/pages/front", f"{Globals.X_PATH}/www/static/JavaScript/pages", strict=True)
			File_System.copy_folder(f"{Globals.PROJECT_PATH}/Python", f"{Globals.X_PATH}/Python/project/modules", strict=True)




		################################ Helpers

		# Pages (Back-End)
		@staticmethod
		def clean_live_pages():
			path = f"{Globals.X_PATH}/Python/live_pages/"

			files = os.listdir(path)

			for file_name in files:
				# File name and path
				file_path = os.path.join(path, file_name)

				if os.path.isfile(file_path) and file_name != "__init__.py": File_System.delete_file(file_path, strict=True)

		# Python (Modules)
		@staticmethod
		def clean_external_copied_Python_modules():
			path = f"{Globals.X_PATH}/Python/project/modules/"

			files = os.listdir(path)

			for file_name in files:
				# File name and path
				file_path = os.path.join(path, file_name)

				if os.path.isfile(file_path): File_System.delete_file(file_path, strict=True)

		@staticmethod
		def load_external_HTML():
			for file in os.listdir(f'{Globals.PROJECT_PATH}/HTML'):
				# Check if file is a HTML file
				if not file.endswith(".html"): continue

				try:
					with open(f'{Globals.PROJECT_PATH}/HTML/{file}', "r") as HTML:
						Globals.PROJECT_HTML[os.path.splitext(file)[0]] = HTML.read()

					Log.success(f"HTML loaded: {file}")

				except: Log.warning(f"Could not load the HTML file: {file}")

		@staticmethod
		def load_external_SVG():
			for file in os.listdir(f'{Globals.PROJECT_PATH}/SVG'):
				# Check If File Is A SVG File
				if not file.endswith(".svg"): continue

				try:
					with open(f'{Globals.PROJECT_PATH}/SVG/{file}', "r") as svg:
						Globals.PROJECT_SVG[os.path.splitext(file)[0]] = svg.read()

					Log.success(f"SVG Loaded: {file}")

				except:
					Log.warning(f"Could Not Load The SVG: {file}")
