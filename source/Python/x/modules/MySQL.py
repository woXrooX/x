#### executemany
# https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-executemany.html
# Execute the prepared statement multiple times with different values
# params = [
#     ("value1", "value2"),
#     ("value3", "value4"),
#     ("value5", "value6")
# ]
#
# In Python, a tuple containing a single value must include a comma.
# For example, ('abc') is evaluated as a scalar while ('abc',) is evaluated as a tuple.

# mysql.connector.set_charset_collation(charset, collation) is used to change charset, collation settings on an existing connection.


if __name__ != "__main__":
	import mysql.connector
	from Python.x.modules.Logger import Log
	from Python.x.modules.Globals import Globals

	class MySQL:
		user = password = host = database = charset = collate = connection_mode = None

		connection = None
		cursor = None

		enabled = False




		######### APIs / Methods
		# Init MySQL
		@staticmethod
		def init():
			if(
				Globals.CONF.get("database", {}).get("enabled", False) is not True or
				Globals.CONF.get("database", {}).get("MySQL", {}).get("enabled", False) is not True
			): return

			MySQL.user = Globals.CONF["database"]["MySQL"]["user"]
			MySQL.password = Globals.CONF["database"]["MySQL"]["password"]
			MySQL.host = Globals.CONF["database"]["MySQL"]["host"]
			MySQL.database = Globals.CONF["database"]["MySQL"]["name"]
			MySQL.charset = Globals.CONF["database"]["MySQL"]["charset"]
			MySQL.collate = Globals.CONF["database"]["MySQL"]["collate"]
			MySQL.connection_mode = Globals.CONF["database"]["MySQL"].get("connection_mode", "per_query")

			Log.info(f"MySQL.init(): Initializing MySQL in mode: {MySQL.connection_mode}")

			if MySQL.connection_mode == "single" and MySQL.connect() is False: return

			MySQL.enabled = True

			MySQL.get_currencies()
			MySQL.get_languages()
			MySQL.get_user_authenticity_statuses()
			MySQL.get_user_roles()
			MySQL.get_user_occupations()
			MySQL.get_notification_events()
			MySQL.get_notification_types()


		@staticmethod
		def execute(
			sql,
			params = None,

			# Enables multi-statement queries
			multi = False,

			# If True triggers executemany with many params
			many = False,

			commit = False,
			fetch_one = False,

			include_MySQL_data = False
		):
			# Log.info(f"MySQL.execute():\nsql: {sql}\nparams: {params}\ncommit: {commit}")

			# Check If MySQL Is Enabled
			if MySQL.enabled is False: return False

			# Many and multi can not work together
			if multi is True and many is True: return False

			# Variable for the results of multi execution
			multi_execute_result = None

			query = None
			row_count = None
			last_row_id = None

			# MySQL response data
			data = None

			# MySQL.execute results
			result = None

			#### Execute
			try:
				#### Connection
				# Connect on "per_query" mode
				if MySQL.connection_mode == "per_query" and MySQL.connect() is False: return False

				# For single mode, check if connection exists and is alive else try to reconnect
				elif MySQL.connection_mode == "single":
					if not MySQL.connection or not MySQL.connection.is_connected():
						if MySQL.connect() is False: return False

				# Start Transaction: Execute SQL statements within the transaction
				if MySQL.connection_mode == "per_query" and commit is True: MySQL.cursor.execute("START TRANSACTION;")



				# Check if params evaluated to True
				params = params or []

				#### Execution types
				# Many execution
				if many is True: MySQL.cursor.executemany(sql, params)

				# Multi execution
				elif multi is True: multi_execute_result = MySQL.cursor.execute(sql, params, multi=True)

				# Default execution
				else: MySQL.cursor.execute(sql, params)

				query = MySQL.cursor.statement
				row_count = MySQL.cursor.rowcount
				last_row_id = MySQL.cursor.lastrowid


				# Multi
				if multi is True:
					data = []
					query = []
					row_count = []
					last_row_id = []

					for cur in multi_execute_result:
						data.extend(cur.fetchall())
						query.append(MySQL.cursor.statement)
						row_count.append(MySQL.cursor.rowcount)
						last_row_id.append(MySQL.cursor.lastrowid)

				# "fetch_one" enabled
				# NOTE: In case multi=True and fetch_one=True will execute the code above.
				elif fetch_one is True: data = MySQL.cursor.fetchone()

				# Default "fetchall"
				else: data = MySQL.cursor.fetchall()

				#### Save execution information before MySQL.disconnect() cleans them up
				# Construct the result
				if include_MySQL_data is True:
					result = {
						"data": data,
						"query": query,

						# This read-only property returns the number of rows returned for SELECT statements,
						# or the number of rows affected by DML statements such as INSERT or UPDATE or DELETE.
						"row_count": row_count,

						# This read-only property returns the value generated for an AUTO_INCREMENT column by
						# the previous INSERT or UPDATE statement or None when there is no such value available.
						# NOTE: For regular UPDATE operations that don't change the primary key, lastrowid won't provide the ID of the updated row.
						"last_row_id": last_row_id
					}

				else: result = data

				# Commit the transaction to make the changes permanent
				if MySQL.connection_mode == "per_query" and commit is True: MySQL.cursor.execute("COMMIT;")

			except mysql.connector.Error as err:
				# In case of errors, rollback the transaction
				if MySQL.connection_mode == "per_query" and commit is True: MySQL.cursor.execute("ROLLBACK;")

				# If connection lost in single mode, try to reconnect
				if MySQL.connection_mode == "single":
					if(
						err.errno == mysql.connector.errorcode.CR_SERVER_LOST or
						err.errno == mysql.connector.errorcode.CR_SERVER_GONE_ERROR
					):
						Log.fieldset("Connection lost. Attempting to reconnect...", "MySQL.execute()", "warning")
						MySQL.connect()

				Log.fieldset(f"ERROR: {str(err)}\nNO: {err.errno}\nSQL STATE: {err.sqlstate}\nMESSAGE: {err.msg}", "MySQL.execute()", "error")

				if include_MySQL_data is True:
					return {
						"error": True,
						"error_no": err.errno,
						"sql_state": err.sqlstate,
						"error_message": err.msg,
						"error_raw": err
					}

				return False

			except Exception as err:
				# In case of errors, rollback the transaction
				if MySQL.connection_mode == "per_query" and commit is True: MySQL.cursor.execute("ROLLBACK;")

				Log.fieldset(f"ERROR: {err}", "MySQL.execute()", "error")

				return False

			finally:
				# Only disconnect in "per_query" mode
				if MySQL.connection_mode == "per_query": MySQL.disconnect()

			return result

		######### Helpers
		@staticmethod
		def connect():
			# Log.info("MySQL.connect()")

			if MySQL.connection_mode == "single":
				# If already connected in "single" mode, return True
				if MySQL.connection and MySQL.connection.is_connected(): return True

				# If connection exists but is dead, clean it up first
				elif MySQL.connection: MySQL.clean_up()

			try:
				MySQL.connection = mysql.connector.connect(
					user=MySQL.user,
					password=MySQL.password,
					host=MySQL.host,
					database=MySQL.database,

					# When use_pure = True, it enforces the use of pure Python implementation of the MySQL protocol,
					# whereas use_pure = False uses the C Extension implementation.
					use_pure=False,

					charset=MySQL.charset,
					collation=MySQL.collate
				)

				# Create Cursor
				MySQL.cursor = MySQL.connection.cursor(dictionary = True)

				# Set session variables for better connection handling
				if MySQL.connection_mode == "single":
					# For "single" connecton mode we use autocommit
					MySQL.cursor.execute("SET autocommit = 1;")  # Enable autocommit
					# MySQL.cursor.execute("SET autocommit = 0")  # Disable autocommit

					# 28800 seconds = 8 hours
					MySQL.cursor.execute("SET SESSION wait_timeout = 28800;")
					MySQL.cursor.execute("SET SESSION interactive_timeout = 28800;")

				Log.fieldset(f"Connection ID: {MySQL.connection.connection_id}", "MySQL.connect()", "success")

				return True

			except Exception as e:
				Log.fieldset(f"ERROR: {e}", "MySQL.connect()", "error")
				return False

		# Check if connection is alive and reconnect if necessary
		@staticmethod
		def ping():
			Log.info("MySQL.ping()")

			if MySQL.connection_mode != "single": return False

			try:
				if MySQL.connection:
					Log.warning(f"MySQL.ping(): Trying to ping")
					MySQL.connection.ping(reconnect=True, attempts=3, delay=5)
					return MySQL.connection.is_connected()

				return False

			except Exception as e:
				Log.fieldset(f"Ping failed: {e}", "MySQL.ping()", "error")
				return False

		@staticmethod
		def disconnect():
			# Log.info("MySQL.disconnect()")

			if MySQL.connection_mode == "per_query":
				if MySQL.cursor: MySQL.cursor.close()
				if MySQL.connection: MySQL.connection.close()

		# Call when shutting down application
		@staticmethod
		def clean_up():
			# Log.info("MySQL.clean_up()")

			if MySQL.cursor: MySQL.cursor.close()
			if MySQL.connection: MySQL.connection.close()



		######### DB getters
		@staticmethod
		def get_currencies():
			data = MySQL.execute("SELECT * FROM currencies;")
			if data is False: return Log.fieldset("Could not fetch 'currencies'", "MySQL.get_currencies()", "error")
			for currency in data: Globals.CURRENCIES[currency["code"]] = currency

		@staticmethod
		def get_languages():
			languages = MySQL.execute("SELECT * FROM languages")
			if languages is False: return Log.fieldset("Could Not Fetch 'languages'", "MySQL.get_languages()", "error")
			for language in languages: Globals.LANGUAGES[language["code"]] = language

		@staticmethod
		def get_user_authenticity_statuses():
			data = MySQL.execute("SELECT * FROM user_authenticity_statuses")
			if data is False: return Log.fieldset("Could Not Fetch 'user_authenticity_statuses'", "MySQL.get_user_authenticity_statuses()", "error")
			for user_authenticity_status in data: Globals.USER_AUTHENTICITY_STATUSES[user_authenticity_status["name"]] = user_authenticity_status

		@staticmethod
		def get_user_roles():
			data = MySQL.execute("SELECT * FROM user_roles")
			if data is False: return Log.fieldset("Could Not Fetch 'user_roles'", "MySQL.get_user_roles()", "error")
			for user_role in data: Globals.USER_ROLES[user_role["name"]] = user_role

		@staticmethod
		def get_user_occupations():
			data = MySQL.execute("SELECT * FROM user_occupations")
			if data is False: return Log.fieldset("Could Not Fetch 'user_occupations'", "MySQL.get_user_occupations()", "error")
			for user_occupation in data: Globals.USER_OCCUPATIONS[user_occupation["name"]] = user_occupation

		@staticmethod
		def get_notification_events():
			data = MySQL.execute("SELECT * FROM notification_events")
			if data is False: return Log.fieldset("Could Not Fetch 'notification_events'", "MySQL.get_notification_events()", "error")
			for notification_event in data: Globals.NOTIFICATION_EVENTS[notification_event["name"]] = notification_event

		@staticmethod
		def get_notification_types():
			data = MySQL.execute("SELECT * FROM notification_types")
			if data is False: return Log.fieldset("Could Not Fetch 'notification_types'", "MySQL.get_notification_types()", "error")
			for notification_type in data: Globals.NOTIFICATION_TYPES[notification_type["name"]] = notification_type
