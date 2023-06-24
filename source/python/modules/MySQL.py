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

    class MySQL:
        user = password = host = database = charset = collate = None

        connection = None
        cursor = None

        lastQuery = None
        rowCount = None
        lastInsertedRowID = None
        lastFetchedData = None

        enabled = False
        hasError = False

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

        # Execute
        @staticmethod
        def execute(
            sql,
            params = [],

            # Enables multiple queries in a single request
            multi = False,

            # If True triggers executemany with many params
            many = False,
            commit = False,
            prepared = True,
            dictionary = True,
            fetchOne = False
        ):
            # Check If MySQL Is Enabled
            if MySQL.enabled is False: return False

            # Clean Up Variables
            MySQL.clean()

            # Check If Connected Successfully
            if MySQL.connect(prepared, dictionary) is False: return False

            # Execute
            try:
                #### Start Transaction
                # Execute SQL statements within the transaction
                if commit is True: MySQL.connection.start_transaction()

                # Default execution
                if(
                    # When many and multi is False
                    multi is False and
                    many is False or

                    # many and multi can not work together
                    multi is True and
                    many is True

                ): MySQL.cursor.execute(sql, params)

                # Many execution
                elif many is True: MySQL.cursor.executemany(sql, params)

                # Multi execution
                elif multi is True:
                    for res in MySQL.cursor.execute(sql, params, multi): pass

                # Invalid Funtion Arguments Combination Was Used
                else: return False

                #### Commit the transaction to make the changes permanent
                if commit is True: MySQL.connection.commit()

                #### Save Execution Information Before MySQL.disconnect() Cleans Them Up
                # Save Last Query For Later Use
                MySQL.lastQuery = MySQL.cursor.statement

                # Save Affected Rows Count For Later Use
                MySQL.rowCount = MySQL.cursor.rowcount

                # Save Affected Rows Count For Later Use
                MySQL.lastInsertedRowID = MySQL.cursor.lastrowid

                # Data
                if fetchOne is True: MySQL.lastFetchedData = MySQL.cursor.fetchone()
                else: MySQL.lastFetchedData = MySQL.cursor.fetchall()

            except Exception as e:
                print(f"ERROR: {e}")
                return False

            # Close The Connection
            MySQL.disconnect()

            # Data / Success
            return MySQL.lastFetchedData

        ######### Getters
        @staticmethod
        def getLastQuery(): return MySQL.lastQuery

        # The cursor.rowcount attribute returns the number of rows affected by the last executed SQL statement.
        @staticmethod
        def getLastAffectedRowsCount(): return MySQL.rowCount

        # the cursor.lastrowid attribute provides the ID of the last row
        # that was inserted into a table with an auto-increment primary key.
        @staticmethod
        def getLastInsertedRowID(): return MySQL.lastInsertedRowID

        @staticmethod
        def getLastFetchedData(): return MySQL.lastFetchedData

        ######### Helpers
        # Connect
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

                return True

            except Exception as e:
                print(f"ERROR: {e}")

                return False

        # Disconnect
        @staticmethod
        def disconnect():
            MySQL.connection.close()
            MySQL.cursor.close()

        # Clean Static Variables
        @staticmethod
        def clean():
            MySQL.lastQuery = None
            MySQL.rowCount = None
            MySQL.lastInsertedRowID = None
            MySQL.lastFetchedData = None




