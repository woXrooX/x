if __name__ != "__main__":
	import os
	import sys
	import shutil

	from Python.x.modules.Logger import Log

	class File_System:
		################################ Helpers
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

		# Will copy all the files in a folder with a given extension
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
