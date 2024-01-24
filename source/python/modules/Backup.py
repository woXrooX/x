if __name__ != "__main__":
	import datetime
	import subprocess

	from python.modules.Logger import Log
	from python.modules.Globals import Globals
	from python.modules.FileSystem import FileSystem
	from python.modules.MySQL import MySQL

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

			if FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/Backups/{Backup.timestamp}/database') is not True: return False

			# MySQL clone logic...

			return True

		# Assets folder
		@staticmethod
		def assets():
			return FileSystem.copyFolder(f'{Globals.X_RUNNING_FROM}/assets', f'{Globals.PROJECT_RUNNING_FROM}/Backups/{Backup.timestamp}/assets')

		# Users folder
		@staticmethod
		def users():
			return FileSystem.copyFolder(f'{Globals.X_RUNNING_FROM}/users', f'{Globals.PROJECT_RUNNING_FROM}/Backups/{Backup.timestamp}/users')

		@staticmethod
		def generateTimestampFolder():
			Backup.timestamp = str(datetime.datetime.now().replace(microsecond=0))
			return FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/Backups/{Backup.timestamp}/')
