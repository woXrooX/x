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
		def create():
			if Backup.generateTimestampFolder() is not True: return False
			if Backup.database() is not True: return False
			if Backup.assets() is not True: return False
			if Backup.users() is not True: return False

			Backup.timestamp = None

			return True

		@staticmethod
		def database():
			# Check if database is not enabled
			if Globals.CONF.get("database", {}).get("MySQL", {}).get("enabled", False) is not True: return True

			if FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/Backups/{Backup.timestamp}/database', strict = False) is not True: return False

			# try:

			# command = f"mysqldump -u {Globals.CONF['database']['MySQL']['user']} -p {Globals.CONF['database']['MySQL']['name']} > '{Globals.PROJECT_RUNNING_FROM}/Backups/{Backup.timestamp}/database/all.sql'"
			# process = subprocess.run(command, shell=True, capture_output=True, input=Globals.CONF['database']['MySQL']['password'].encode())
			# print(process)

			# process = subprocess.Popen(command, shell=True)
			# process.stdin.write(Globals.CONF['database']['MySQL']['password'].encode())
			# process.stdin.flush()
			# output, error = process.communicate()
			# print(process)


			# Log.info(f"FileSystem.database(): Output: {output.decode()} | Error: {error.decode()}")

			return True

			# except:
			# 	Log.error(f"Backup.database(): The mysqldump failed")

			# 	return False



		# Assets folder
		@staticmethod
		def assets():
			return FileSystem.copyFolder(f'{Globals.X_RUNNING_FROM}/assets', f'{Globals.PROJECT_RUNNING_FROM}/Backups/{Backup.timestamp}/assets', strict = False)

		# Users folder
		@staticmethod
		def users():
			return FileSystem.copyFolder(f'{Globals.X_RUNNING_FROM}/users', f'{Globals.PROJECT_RUNNING_FROM}/Backups/{Backup.timestamp}/users', strict = False)

		@staticmethod
		def generateTimestampFolder():
			Backup.timestamp = str(datetime.datetime.now().replace(microsecond=0))
			return FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/Backups/{Backup.timestamp}/', strict = False)
