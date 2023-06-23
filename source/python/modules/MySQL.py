if __name__ != "__main__":
    import mysql.connector

    class MySQL:
        #################### Static
        ########## Static Methods
        @staticmethod
        def setUp(user, password, host, database, charset, collate):
            # Enabler
            # MySQL.enabled = True

            MySQL.user = user
            MySQL.password = password
            MySQL.host = host
            MySQL.database = database
            MySQL.charset = charset
            MySQL.collate = collate

        ########## Static Variables
        # enabled = False


        def __init__(self, prep=True):
            # Check If MySQL Is Enabled
            # if MySQL.enabled == False: return False

            self._hasError = False

            self._conn = mysql.connector.connect(
                user = MySQL.user,
                password = MySQL.password,
                host = MySQL.host,
                database = MySQL.database,
                use_pure=True
            )

            self._conn.set_charset_collation(MySQL.charset, MySQL.collate)

            if prep: self._curs = self._conn.cursor(prepared=True)
            else: self._curs = self._conn.cursor(dictionary=True)

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc_value, traceback):
            self.close()

        @property
        def connection(self):
            return self._conn

        @property
        def cursor(self):
            return self._curs

        def lastQuery(self):
            return self.cursor.statement

        def execute(self, sql, params=None, multi=False):
            try:
                self.cursor.execute(sql, params or (), multi)
            except:
                self._hasError = True

        def fetchOne(self):
            # Check If Execute Has Error
            if self._hasError == True: return False

            return self.cursor.fetchone()

        def fetchAll(self):
            # Check If Execute Has Error
            if self._hasError == True: return False

            return self.cursor.fetchall()

        def fetchmany(self):
            # Check If Execute Has Error
            if self._hasError == True: return False

            return self.cursor.fetchmany()

        def rowcount(self):
            # Check If Execute Has Error
            if self._hasError == True: return False

            return self.cursor.rowcount

        def lastrowid(self):
            # Check If Execute Has Error
            if self._hasError == True: return False

            return self.cursor.lastrowid

        # Error
        def hasError(self):
            return self._hasError

        def commit(self):
            self.connection.commit()

        def close(self, commit=True):
            if commit:
                self.commit()
            self.cursor.close()
            self.connection.close()
