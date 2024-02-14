if __name__ != "__main__":
	import hashlib

	from python.modules.Globals import Globals
	from python.modules.MySQL import MySQL

	class LogInTools():

		# Returns "False" if disabled or gets falsey value from MySQL.execute()
		# Returns "True" if succeeds
		@staticmethod
		def newRecord(ip_address, user_agent, success = False):
			if "enableRecording" in Globals.CONF["tools"]["logInTools"] and Globals.CONF["tools"]["logInTools"]["enableRecording"] is False: return False

			res = MySQL.execute(
				sql="INSERT INTO login_records (ip_address, user_agent, success) VALUES (%s, %s, %s);",
				params=(ip_address, user_agent, success),
				commit=True
			)

			if res is False: return False

			return True


		@staticmethod
		def passwordHash(password):
			if Globals.CONF["password"]["hashing_algorithm"] == "SHA-256": return hashlib.sha256(password.encode()).hexdigest()

			return password

