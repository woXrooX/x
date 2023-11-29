if __name__ != "__main__":
	from main import session
	from python.modules.Globals import Globals
	from python.modules.MySQL import MySQL
	from python.modules.User import User

	class Notifications():
		@staticmethod
		@User.checkIfUserInSession
		def new(
			owner = None,
			content = "",
			type_name = None
		):
			user_id = owner if type(owner) is int and owner > 0 else session["user"]["id"]
			type_id = Globals.NOTIFICATION_TYPES[type_name]["id"] if type_name in Globals.NOTIFICATION_TYPES else Globals.NOTIFICATION_TYPES["warning"]["id"]

			data = MySQL.execute(
				sql="INSERT INTO notifications (owner, content, type) VALUES (%s, %s, %s);",
				params=(user_id, content, type_id),
				commit=True
			)

			if data is False: return False

			return True

		# Gets the all notifications related to the current user (the user in the current session)
		@staticmethod
		@User.checkIfUserInSession
		def getAll():
			data = MySQL.execute(
				sql="SELECT * FROM notifications WHERE user=%s",
				params=(session["user"]["id"],)
			)

			if data is False: return False

			return data

		@staticmethod
		@User.checkIfUserInSession
		def markAsSeen(id):
			data = MySQL.execute(
				sql="UPDATE notifications SET seen=1 WHERE id=%s AND owner=%s;",
				params=(id, session["user"]["id"]),
				commit=True
			)

			if data is False: return False

			return True
