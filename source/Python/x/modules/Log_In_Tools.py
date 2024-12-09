if __name__ != "__main__":
	import hashlib

	from main import session

	from Python.x.modules.Globals import Globals
	from Python.x.modules.MySQL import MySQL

	class Log_In_Tools():

		# Returns "False" if disabled or gets falsey value from MySQL.execute()
		# Returns "True" if succeeds
		@staticmethod
		def new_record(request, message = None):
			if "enable_recording" in Globals.CONF["tools"]["log_in_tools"] and Globals.CONF["tools"]["log_in_tools"]["enable_recording"] is False: return False

			res = MySQL.execute(
				sql="INSERT INTO log_in_records (user, ip_address, x_forwarded_for, user_agent, message) VALUES (%s, %s, %s, %s, %s);",
				params=[
					session["user"]["id"] if "user" in session else None,
					request.remote_addr,
					request.headers.get('X-Forwarded-For', None),
					request.headers.get('User-Agent', None),
					message
				],
				commit=True
			)
			if res is False: return False

			return True


		@staticmethod
		def password_hash(password):
			if Globals.CONF["password"]["hashing_algorithm"] == "SHA-256": return hashlib.sha256(password.encode()).hexdigest()

			return password

