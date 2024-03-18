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
	from python.modules.Logger import Log
	from python.modules.Globals import Globals

	class MySQL:
		user = password = host = database = charset = collate = None

		connection = None
		cursor = None

		enabled = False




		######### APIs / Methods
		# Init MySQL
		@staticmethod
		def init(user, password, host, database, charset, collate):
			MySQL.enabled = True

			MySQL.user = user
			MySQL.password = password
			MySQL.host = host
			MySQL.database = database
			MySQL.charset = charset
			MySQL.collate = collate

			# Globals.USER_AUTHENTICITY_STATUSES
			MySQL.getUserAuthenticityStatuses()

			# Globals.USER_ROLES
			MySQL.getUserRoles()

			# Globals.NOTIFICATION_TYPES
			MySQL.getNotificationTypes()

			# Globals.LANGUAGES
			MySQL.getLanguages()


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
			fetchOne = False,

			includeMySQLData = False
		):
			# Check If MySQL Is Enabled
			if MySQL.enabled is False: return False

			# Many and multi can not work together
			if multi is True and many is True: return False

			# Check If Connected Successfully
			if MySQL.connect(prepared, dictionary) is False: return False

			# Variable for the results of multi execution
			multi_execute_result = None

			query = None
			rowCount = None
			lastRowID = None


			# MySQL response data
			data = None

			# MySQL.execute results
			result = None

			# Execute
			try:
				# Start Transaction: Execute SQL statements within the transaction
				if commit is True: MySQL.connection.start_transaction()

				# Check If params Evaluated To True
				params = params or ()

				# Many execution
				if many is True: MySQL.cursor.executemany(sql, params)

				# Multi execution
				elif multi is True: multi_execute_result = MySQL.cursor.execute(sql, params, multi=True)


				# Default execution
				else: MySQL.cursor.execute(sql, params)

				query = MySQL.cursor.statement
				rowCount = MySQL.cursor.rowcount
				lastRowID = MySQL.cursor.lastrowid


				# Multi
				if multi is True:
					data = []
					query = []
					rowCount = []
					lastRowID = []

					for cur in multi_execute_result:
						data.extend(cur.fetchall())
						query.append(MySQL.cursor.statement)
						rowCount.append(MySQL.cursor.rowcount)
						lastRowID.append(MySQL.cursor.lastrowid)

				# "fetchone" enabled
				# NOTE: In case multi=True and fetchOne=True will execute the code above.
				elif fetchOne is True: data = MySQL.cursor.fetchone()

				# Default "fetchall"
				else: data = MySQL.cursor.fetchall()

				#### Save execution information before MySQL.disconnect() cleans them up
				# Construct the result
				if includeMySQLData is True:
					result = {
						"data": data,
						"query": query,

						# This read-only property returns the number of rows returned for SELECT statements,
						# or the number of rows affected by DML statements such as INSERT or UPDATE or DELETE.
						"rowCount": rowCount,

						# This read-only property returns the value generated for an AUTO_INCREMENT column by
						# the previous INSERT or UPDATE statement or None when there is no such value available.
						"lastRowID": lastRowID
					}

				else: result = data

			except Exception as e:
				# In case of errors, rollback the transaction
				if commit is True: MySQL.connection.rollback()

				Log.fieldset(f"ERROR: {e}", "MySQL.execute()")
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

				Log.fieldset(f"Connection ID: {MySQL.connection.connection_id}", "MySQL.connect()")

				return True

			except Exception as e:
				Log.fieldset(f"ERROR: {e}", "MySQL.connect()")
				return False

		@staticmethod
		def disconnect():
			MySQL.connection.close()
			MySQL.cursor.close()





		######### Helpers / DB getters
		@staticmethod
		def getUserAuthenticityStatuses():
			data = MySQL.execute("SELECT * FROM user_authenticity_statuses")
			if data is False: return Log.fieldset("Could Not Fetch 'user_authenticity_statuses'", "MySQL.getUserAuthenticityStatuses()")
			for user_authenticity_status in data: Globals.USER_AUTHENTICITY_STATUSES[user_authenticity_status["name"]] = user_authenticity_status

		@staticmethod
		def getUserRoles():
			data = MySQL.execute("SELECT * FROM user_roles")
			if data is False: return Log.fieldset("Could Not Fetch 'user_roles'", "MySQL.getUserRoles()")
			for user_role in data: Globals.USER_ROLES[user_role["name"]] = user_role

		@staticmethod
		def getNotificationTypes():
			data = MySQL.execute("SELECT * FROM notification_types")
			if data is False: return Log.fieldset("Could Not Fetch 'notification_types'", "MySQL.getNotificationTypes()")
			for notification_type in data: Globals.NOTIFICATION_TYPES[notification_type["name"]] = notification_type

		@staticmethod
		def getLanguages():
			languages = MySQL.execute("SELECT * FROM languages")
			if languages is False: return Log.fieldset("Could Not Fetch 'languages'", "MySQL.getUserAuthenticityStatuses()")
			for language in languages: Globals.LANGUAGES[language["code"]] = language
