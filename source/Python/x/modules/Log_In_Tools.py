if __name__ != "__main__":
	import hashlib
	import logging

	from main import session

	from Python.x.modules.Globals import Globals
	from Python.x.modules.PostgreSQL import PostgreSQL
	from Python.x.modules.IP_address_tools import extract_IP_address_from_request

	class Log_In_Tools():

		# Returns "False" if disabled
		# Returns "True" if succeeds
		@staticmethod
		def new_record(request, message = None):
			if "enable_recording" in Globals.CONF["tools"]["log_in_tools"] and Globals.CONF["tools"]["log_in_tools"]["enable_recording"] is False: return False

			res = PostgreSQL.execute(
				SQL="""
					INSERT INTO "log_in_records" ("user", "IP_address", "user_agent", "message")
					VALUES (%s, %s, %s, %s);
				""",
				params=[
					session["user"]["id"] if "user" in session else None,
					extract_IP_address_from_request(request),
					request.headers.get('User-Agent', None),
					message
				]
			)
			if "error" in res: return False

			return True

		@staticmethod
		def log_failed_log_in(request):
			if "enable_log_failed_log_in" in Globals.CONF["tools"]["log_in_tools"] and Globals.CONF["tools"]["log_in_tools"]["enable_log_failed_log_in"] is False: return False

			LOG_PATH_AND_FILE = f"{Globals.PROJECT_PATH}/Logs/auth.log"

			# Initialize the auth logger
			auth_logger = logging.getLogger("x_auth")
			auth_logger.setLevel(logging.WARNING)

			file_handler = logging.FileHandler(
				LOG_PATH_AND_FILE,

				# Keeps the file closed until the first log entry is written
				delay=True
			)

			# Format required for fail2ban parsing
			formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
			file_handler.setFormatter(formatter)
			auth_logger.addHandler(file_handler)

			auth_logger.warning(f"Failed login attempt for user from IP: {extract_IP_address_from_request(request)}")

		@staticmethod
		def password_hash(password):
			if Globals.CONF["password"]["hashing_algorithm"] == "SHA-256": return hashlib.sha256(password.encode()).hexdigest()

			return password

