if __name__ != "__main__":
	from main import session
	from python.modules.Globals import Globals
	from python.modules.MySQL import MySQL

	class Notifications():
		@staticmethod
		def new(recipient, content, type_name):
			if int(recipient) <= 0: return False

			if type_name not in Globals.NOTIFICATION_TYPES: return False
			type_id = Globals.NOTIFICATION_TYPES[type_name]["id"] if type_name in Globals.NOTIFICATION_TYPES else Globals.NOTIFICATION_TYPES["error"]["id"]

			data = MySQL.execute(
				sql="INSERT INTO notifications (recipient, content, type) VALUES (%s, %s, %s);",
				params=[recipient, content, Globals.NOTIFICATION_TYPES[type_name]["id"]],
				commit=True
			)
			if data is False: return False
			return True

		@staticmethod
		def get_all(recipient = None):
			if int(recipient) <= 0: return False

			data = MySQL.execute(
				sql="""
					SELECT
						notifications.*,
						notification_events.name as event,
						notification_types.name as type
					FROM notifications
					LEFT JOIN notification_events ON notification_events.id = notifications.event
					LEFT JOIN notification_types ON notification_types.id = notifications.type
					WHERE recipient=%s
					ORDER BY timestamp DESC;
				""",
				params=[recipient]
			)
			return data

		@staticmethod
		def set_seen(id, recipient):
			if int(recipient) <= 0: return False

			data = MySQL.execute(
				sql="UPDATE notifications SET seen=1 WHERE id=%s AND recipient=%s;",
				params=[id, recipient],
				commit=True
			)
			if data is False: return False
			return True
