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

				# Multi
				if multi is True:
					data = []
					for cur in multi_execute_result: data.extend(cur.fetchall())

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
						"query": MySQL.cursor.statement,

						# This read-only property returns the number of rows returned for SELECT statements,
						# or the number of rows affected by DML statements such as INSERT or UPDATE or DELETE.
						"rowCount": MySQL.cursor.rowcount,

						# This read-only property returns the value generated for an AUTO_INCREMENT column by
						# the previous INSERT or UPDATE statement or None when there is no such value available.
						"lastRowID": MySQL.cursor.lastrowid
					}

				else: result = data

			except Exception as e:
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
