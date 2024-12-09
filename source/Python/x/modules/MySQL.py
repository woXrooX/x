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

if __name__ != "__main__":
	import mysql.connector
	from Python.x.modules.Logger import Log
	from Python.x.modules.Globals import Globals

	class MySQL:
		user = password = host = database = charset = collate = None

		connection = None
		connected = False
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

			MySQL.enabled = True

			MySQL.get_user_authenticity_statuses()
			MySQL.get_user_roles()
			MySQL.get_user_occupations()
			MySQL.get_notification_types()
			MySQL.get_notification_events()
			MySQL.get_languages()

			Log.success("MySQL.init(): MySQL has been initialized")


		@staticmethod
		def execute(
			sql,
			params = None,

			# Enables multi-statement queries
			multi = False,

			# If True triggers executemany with many params
			many = False,

			commit = False,
			prepared = True,
			dictionary = True,
			fetch_one = False,

			include_MySQL_data = False
		):
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

			# Check if connected successfully
			if MySQL.connect(prepared, dictionary) is False: return False

			# Execute
			try:
				# Start Transaction: Execute SQL statements within the transaction
				if commit is True: MySQL.connection.start_transaction()

				# Check if params evaluated to True
				params = params or []

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

			except mysql.connector.Error as err:
				# In case of errors, rollback the transaction
				if commit is True: MySQL.connection.rollback()

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
				if commit is True: MySQL.connection.rollback()

				Log.fieldset(f"ERROR: {err}", "MySQL.execute()", "error")

				return False

			finally:
				# Commit the transaction to make the changes permanent
				if commit is True: MySQL.connection.commit()

				# Close The Connection
				MySQL.disconnect()

			return result

		######### Helpers
		@staticmethod
		def connect(
			prepared = True,
			dictionary = True
		):
			try:
				MySQL.connection = mysql.connector.connect(
					user=MySQL.user,
					password=MySQL.password,
					host=MySQL.host,
					database=MySQL.database,

					# When use_pure = True, it enforces the use of pure Python implementation of the MySQL protocol,
					# whereas use_pure = False uses the C Extension implementation.
					use_pure=False
				)

				MySQL.connection.set_charset_collation(
					charset=MySQL.charset,
					collation=MySQL.collate
				)

				# Create Cursor
				MySQL.cursor = MySQL.connection.cursor(
					# prepared=prepared,
					dictionary=dictionary
				)

				Log.fieldset(f"Connection ID: {MySQL.connection.connection_id}", "MySQL.connect()", "success")

				return True

			except Exception as e:
				Log.fieldset(f"ERROR: {e}", "MySQL.connect()", "error")
				return False

		@staticmethod
		def disconnect():
			MySQL.connection.close()
			MySQL.cursor.close()





		######### Helpers / DB getters
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
		def get_notification_types():
			data = MySQL.execute("SELECT * FROM notification_types")
			if data is False: return Log.fieldset("Could Not Fetch 'notification_types'", "MySQL.get_notification_types()", "error")
			for notification_type in data: Globals.NOTIFICATION_TYPES[notification_type["name"]] = notification_type

		@staticmethod
		def get_notification_events():
			data = MySQL.execute("SELECT * FROM notification_events")
			if data is False: return Log.fieldset("Could Not Fetch 'notification_events'", "MySQL.get_notification_events()", "error")
			for notification_event in data: Globals.NOTIFICATION_EVENTS[notification_event["name"]] = notification_event


		@staticmethod
		def get_languages():
			languages = MySQL.execute("SELECT * FROM languages")
			if languages is False: return Log.fieldset("Could Not Fetch 'languages'", "MySQL.get_languages()", "error")
			for language in languages: Globals.LANGUAGES[language["code"]] = language
