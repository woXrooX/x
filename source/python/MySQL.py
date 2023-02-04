if __name__ != "__main__":
    import mysql.connector

    class MySQL:
        def __init__(self, prep=True):
            self.hasError = False
            self.conn = mysql.connector.connect(
                user = MySQL.user,
                password = MySQL.password,
                host = MySQL.host,
                database = MySQL.database,
                use_pure=True
            )
            self.conn.set_charset_collation(MySQL.charset, MySQL.collate)
            if prep:
                self.curs = self.conn.cursor(prepared=True)
            else:
                self.curs = self.conn.cursor(dictionary=True)

        @staticmethod
        def setUp(user, password, host, database, charset, collate):
            MySQL.user = user
            MySQL.password = password
            MySQL.host = host
            MySQL.database = database
            MySQL.charset = charset
            MySQL.collate = collate

        def __enter__(self):
            return self
        def __exit__(self, exc_type, exc_value, traceback):
            self.close()

        @property
        def connection(self):
            return self.conn
        @property
        def cursor(self):
            return self.curs

        def execute(self, sql, params=None):
            try:
                self.cursor.execute(sql, params or ())
            except:
                self.hasError = True

        def fetchOne(self):
            return self.cursor.fetchone()
        def fetchAll(self):
            return self.cursor.fetchall()
        def fetchmany(self):
            return self.cursor.fetchmany()
        def rowcount(self):
            return self.cursor.rowcount()

        # Error
        def hasError(self):
            return self.hasError

        def commit(self):
            self.connection.commit()
        def close(self, commit=True):
            if commit:
                self.commit()
            self.cursor.close()
            self.connection.close()
