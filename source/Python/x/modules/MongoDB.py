# pip install pymongo
# python3 -m pip install --upgrade pip

if __name__ != "__main__":
    from pymongo.mongo_client import MongoClient

    from Python.x.modules.Globals import Globals

    class MongoDB():
        ######### Variables
        client = MongoClient(Globals.CONF["database"]["MongoDB"]["host"])
        db = client[Globals.CONF["database"]["MongoDB"]["name"]]

        ######### APIs

        #### Insert
        ## One
        @staticmethod
        def insertOne(collection = None, values = None):
            try:
                MongoDB.client['x'][collection].insert_one(values)
                return True
            except:
                return False

        ## Many
        @staticmethod
        def insertMany(collection = None, values = None):
            try:
                MongoDB.client['x'][collection].insert_many(values)
                return True
            except:
                return False

        #### Update
        ## One
        @staticmethod
        def updateOne(collection = None, where = None, values = None):
            try:
                MongoDB.client['x'][collection].update_one(where, {'$set': values})
                return True
            except:
                return False

        ## Many
        @staticmethod
        def updateMany(collection = None, where = None, values = None):
            try:
                MongoDB.client['x'][collection].update_many(where, {'$set': values})

                return True

            except:
                return False

        #### Fetch
        ## One
        # Returns The First Document That Matches The Query
        # Returns None If No Matching Document
        @staticmethod
        def findOne(collection = None, where = {}):
            try:
                document = MongoDB.client['x'][collection].find_one(where)

                return document

            except:
                return False

        ## Many
        # Returns Iterable Cursor Object
        @staticmethod
        def findMany(collection = None, where = {}):
            try:
                # Return None If No Matching Documents
                if MongoDB.count(collection, where) == 0:
                    return None

                cursor = MongoDB.client['x'][collection].find(where)

                return cursor

            except:
                return False

        ## Count
        # Returns Count Of The Documents That Are Matching Query
        @staticmethod
        def count(collection = None, where = {}):
            try:
                count = MongoDB.client['x'][collection].count_documents(where)

                return count

            except:
                return False


        #### Delete
        ## Delete One Document
        # Deletes The First One
        @staticmethod
        def deleteOne(collection = None, where = {}):
            try:
                MongoDB.client['x'][collection].delete_one(where)

                return True

            except:
                return False

        ## Delete Many Documents On A Collection
        @staticmethod
        def deleteMany(collection = None, where = {}):
            try:
                MongoDB.client['x'][collection].delete_many(where)

                return True

            except:
                return False

        ## Delete All Documents On A Collection
        @staticmethod
        def deleteAll(collection = None):
            try:
                MongoDB.deleteMany(collection)

                return True

            except:
                return False

        ## Delete Deletes A Collection
        @staticmethod
        def deleteCollection(collection = None):
            try:
                MongoDB.client['x'][collection].drop()

                return True

            except:
                return False
