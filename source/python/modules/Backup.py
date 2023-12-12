if __name__ != "__main__":
	import datetime

	from python.modules.Logger import Log
	from python.modules.Globals import Globals
	from python.modules.FileSystem import FileSystem

	class Backup():
		@staticmethod
		def all():
			pass

		@staticmethod
		def database():
			pass

		# Assets folder
		@staticmethod
		def assets():
			pass

		# Users folder
		@staticmethod
		def users():
			pass


		@staticmethod
		def generateTimestampFolder():
			timestamp = str(datetime.datetime.now().replace(microsecond=0))
			FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/Backups/{timestamp}/')
