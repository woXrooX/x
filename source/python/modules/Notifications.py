if __name__ != "__main__":
	from main import session
	from python.modules.Globals import Globals
	from python.modules.MySQL import MySQL

	class Notifications():
		@staticmethod
		def new(sender, recipient, content = None, event = None, type_name = None):
			type_id = None
			if type_name is not None:
				type_id = Globals.NOTIFICATION_TYPES[type_name]["id"] if type_name in Globals.NOTIFICATION_TYPES else Globals.NOTIFICATION_TYPES["error"]["id"]

			data = MySQL.execute(
				sql="INSERT INTO notifications (sender, recipient, content, event, type) VALUES (%s, %s, %s, %s, %s);",
				params=[sender, recipient, content, event, type_id],
				commit=True
			)
			if data is False: return False
			return True

		@staticmethod
		def get_all(recipient = None):
			data = MySQL.execute(
				sql="""
					SELECT
						notifications.*,
						notification_events.name as event,
						notification_types.name as type
					FROM notifications
					LEFT JOIN notification_events ON notification_events.id = notifications.event
					LEFT JOIN notification_types ON notification_types.id = notifications.type
					WHERE notifications.recipient=%s
					ORDER BY timestamp DESC;
				""",
				params=[recipient]
			)
			return data

		@staticmethod
		def get_unseen_count(recipient = None):
			data = MySQL.execute(
				sql="""
					SELECT COUNT(*) AS unseen_notifications_count
					FROM notifications
					WHERE recipient=%s AND seen=0;
				""",
				params=[recipient],
				fetchOne=True
			)
			return data

		@staticmethod
		def get_one(ID):
			data = MySQL.execute(
				sql="""
					SELECT
						notifications.*,
						notification_events.name as event,
						notification_types.name as type
					FROM notifications
					LEFT JOIN notification_events ON notification_events.id = notifications.event
					LEFT JOIN notification_types ON notification_types.id = notifications.type
					WHERE notifications.id = %s AND notifications.recipient=%s LIMIT 1;
				""",
				params=[ID, session['user']['id']],
				fetchOne=True
			)
			return data

		@staticmethod
		def set_seen(ID):
			data = MySQL.execute("UPDATE notifications SET seen=1 WHERE id=%s;", [ID], commit=True)
			if data is False: return False
			return True

		@staticmethod
		def delete(ID):
			data = MySQL.execute("DELETE FROM notifications WHERE id=%s AND recipient=%s;", [ID, session["user"]["id"]], commit=True)
			if data is False: return False
			return True
