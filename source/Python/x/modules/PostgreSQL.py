# connection.commit() -> "autocommit: True" makes this not effective

if __name__ != "__main__":
	import sys
	from flask import g

	import psycopg
	from psycopg_pool import ConnectionPool

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
						"autocommit": True
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
		def get_connection():
			if PostgreSQL.initialized is False: return False

			if "DB_connection" not in g: g.DB_connection = PostgreSQL.DB_pool.getconn()

			# Shortcut
			# g.DB_connection.execute() = g.DB_connection.cursor().execute()
			return g.DB_connection, g.DB_connection.cursor()


		# Return connection to pool after each request.
		@staticmethod
		def close_connection(exception):
			if PostgreSQL.initialized is False: return False

			conn = g.pop("DB_connection", None)
			if conn is not None:
				if exception: conn.rollback() # NOTE: Make this happen and check if conn.rollback() works since the autocommit is enabled
				PostgreSQL.DB_pool.putconn(conn)


		@staticmethod
		def reconnect_failed_callback(pool):
			Log.error(f"PostgreSQL.on_reconnect_failed(): Could not connect to server")
			sys.exit(1)

		@staticmethod
		def execute(
			SQL,
			cursor,
			params = []
		):
			try:
				cursor.execute(SQL, tuple(params))
				return True

			except (psycopg.errors.UniqueViolation, psycopg.errors.ForeignKeyViolation) as e:
				Log.error(f"PostgreSQL.execute(): {e}")
				return e.sqlstate

			except psycopg.DatabaseError as e:
				Log.error(f"PostgreSQL.execute(): {e}")
				return e.sqlstate

			except Exception as e:
				Log.error(f"Error: {e}")
				return False
