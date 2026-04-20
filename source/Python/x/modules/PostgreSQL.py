# connection.commit() -> "autocommit: True" makes this not effective

if __name__ != "__main__":
	import sys

	import psycopg
	from psycopg_pool import ConnectionPool
	from psycopg.rows import dict_row

	from Python.x.modules.Logger import Log
	from Python.x.modules.Globals import Globals

	class PostgreSQL:
		initialized = False
		DB_pool = None

		@staticmethod
		def init():
			if PostgreSQL.initialized is True: return True

			try:
				# Create pool at startup
				PostgreSQL.DB_pool = ConnectionPool(
					# conninfo="host=localhost dbname=mydb user=myuser password=mypass",
					conninfo='',
					kwargs={
						"host": Globals.CONF["database"]["PostgreSQL"]["host"],
						"port": Globals.CONF["database"]["PostgreSQL"]["port"],
						"dbname": Globals.CONF["database"]["PostgreSQL"]["dbname"],
						"user": Globals.CONF["database"]["PostgreSQL"]["user"],
						"password": Globals.CONF["database"]["PostgreSQL"]["password"],
						"autocommit": False,
						"row_factory": dict_row
					},
					min_size=2,
					max_size=10,

					# Setting reconnect_timeout=0 will disable retries entirely and fail on the first error
					reconnect_timeout=10,
					reconnect_failed=PostgreSQL.reconnect_failed_callback
				)

				PostgreSQL.DB_pool.open(wait=True, timeout=5)
				PostgreSQL.DB_pool.check()

				PostgreSQL.initialized = True

				Log.success(f"PostgreSQL.init(): Success")

				return True

			except Exception as e:
				PostgreSQL.initialized = False
				Log.error(f"PostgreSQL.init(): {e}")
				sys.exit(1)
				return False

		@staticmethod
		def get_connection_from_pool():
			if PostgreSQL.initialized is False: return False

			connection = PostgreSQL.DB_pool.getconn()

			return connection, connection.cursor()

		@staticmethod
		def put_connection_to_pool(connection):
			if PostgreSQL.initialized is False: return False

			PostgreSQL.DB_pool.putconn(connection)

		@staticmethod
		def reconnect_failed_callback(pool):
			Log.error(f"PostgreSQL.on_reconnect_failed(): Could not connect to server")
			sys.exit(1)

		@staticmethod
		def execute(
			SQL,
			cursor,
			params = None
		):
			try:
				cursor.execute(SQL, tuple(params or ()))
				return True

			except psycopg.DatabaseError as e:
				Log.error(f"PostgreSQL.execute(): {e}")
				return e.sqlstate

			except Exception as e:
				Log.error(f"PostgreSQL.execute(): {e}")
				return False

		@staticmethod
		def execute_v2(
			SQL,
			params = None,
			incoming_connection = None,
			commit = True,
			fetch_type = "all"
		):
			connection = cursor = None
			has_error = False

			if incoming_connection is None: connection, cursor = PostgreSQL.get_connection_from_pool()
			else:
				connection = incoming_connection
				cursor = connection.cursor()

			try:
				cursor.execute(SQL, tuple(params or ()))

				if commit is True: connection.commit()

				response = {}

				if commit is not True: response["connection"] = connection

				if cursor.description is not None:
					match fetch_type:
						case "all": response["data"] = cursor.fetchall()
						case "one": response["data"] = cursor.fetchone()
						case _: pass

				return response

			except psycopg.DatabaseError as e:
				has_error = True

				Log.error(f"PostgreSQL.execute(): {e}")

				return {
					"error": True,
					"SQL_state": e.sqlstate
				}

			except Exception as e:
				has_error = True

				Log.error(f"PostgreSQL.execute(): {e}")

				return { "error": True }

			finally:
				cursor.close()

				if has_error is True:
					connection.rollback()
					PostgreSQL.put_connection_to_pool(connection)

				elif commit is True: PostgreSQL.put_connection_to_pool(connection)
