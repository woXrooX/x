if __name__ != "__main__":
	import datetime
	import subprocess

	from Python.x.modules.Logger import Log
	from Python.x.modules.Globals import Globals
	from Python.x.modules.File_System import File_System
	from Python.x.modules.MySQL import MySQL

	class Backup():
		timestamp = None

		@staticmethod
		def now():
			Log.center("Backup START", '+')

			if Backup.generateTimestampFolder() is not True: return False
			if Backup.database() is not True: return False
			if Backup.assets() is not True: return False
			if Backup.users() is not True: return False

			Backup.timestamp = None

			Log.center("Backup EBD", '+')

			return True

		#### Helpers
		# Meant to be provate methods all below

		@staticmethod
		def database():
			# Check if database is not enabled
			if Globals.CONF.get("database", {}).get("MySQL", {}).get("enabled", False) is not True: return True

			if File_System.create_folder(f'{Globals.PROJECT_PATH}/Backups/{Backup.timestamp}/database') is not True: return False

			# MySQL clone logic...

			return True

		# Assets folder
		@staticmethod
		def assets():
			return File_System.copy_folder(f'{Globals.X_PATH}/assets', f'{Globals.PROJECT_PATH}/Backups/{Backup.timestamp}/assets')

		# Users folder
		@staticmethod
		def users():
			return File_System.copy_folder(f'{Globals.X_PATH}/users', f'{Globals.PROJECT_PATH}/Backups/{Backup.timestamp}/users')

		@staticmethod
		def generateTimestampFolder():
			Backup.timestamp = str(datetime.datetime.now().replace(microsecond=0))
			return File_System.create_folder(f'{Globals.PROJECT_PATH}/Backups/{Backup.timestamp}/')
