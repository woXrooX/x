if __name__ != "__main__":
	import json

	from main import session
	from python.modules.Globals import Globals
	from python.modules.MySQL import MySQL
	from python.modules.SendGrid import SendGrid
	from python.modules.Twilio import Twilio
	from python.modules.Logger import Log

	class Notifications():
		@staticmethod
		def new(
			recipient,
			sender = None,
			content_TEXT = None,
			content_JSON = None,
			event_name = None,
			type_name = None,
			via_in_app = False,
			via_eMail = False,
			via_SMS = False
		):
			recipient = MySQL.execute("SELECT id, eMail, phone_number FROM users WHERE id = %s LIMIT 1;", [recipient], fetch_one = True)
			if recipient is False or recipient is None: return False

			is_successfully = True

			if via_in_app is True:
				if Notifications.new_in_app(recipient["id"], sender, content_TEXT, content_JSON, event_name, type_name) is False:
					Log.warning("Notifications.new() -> Could not create: new_in_app()")
					is_successfully = False

			if via_eMail is True:
				if Notifications.new_eMail(recipient["eMail"], sender, content_TEXT, content_JSON, event_name) is False:
					Log.warning("Notifications.new() -> Could not send: new_eMail()")
					is_successfully = False

			if via_SMS is True:
				if Notifications.new_SMS(recipient["phone_number"], sender, content_TEXT, content_JSON, event_name) is False:
					Log.warning("Notifications.new() -> Could not send: new_SMS()")
					is_successfully = False

			return is_successfully

		@staticmethod
		def new_in_app(
			recipient,
			sender = None,
			content_TEXT = None,
			content_JSON = None,
			event_name = None,
			type_name = None
		):
			data = MySQL.execute(
				sql="INSERT INTO notifications (sender, recipient, content_TEXT, content_JSON, event, type) VALUES (%s, %s, %s, %s, %s, %s);",
				params=[
					sender,
					recipient,
					content_TEXT,
					json.dumps(content_JSON, default=str) if isinstance(content_JSON, dict) else None,
					Globals.NOTIFICATION_EVENTS.get(event_name, {}).get("id", None),
					Globals.NOTIFICATION_TYPES.get(type_name, {}).get("id", None)
				],
				commit=True
			)
			if data is False: return False
			return True

		@staticmethod
		def new_eMail(
			recipient,
			sender = None,
			content_TEXT = None,
			content_JSON = None,
			event_name = None
		):
			if recipient is None: return

			eMail_subject_LANG_DICT_key = f"{event_name}_eMail_subject"
			eMail_content_LANG_DICT_key = f"{event_name}_eMail_content"


			if eMail_subject_LANG_DICT_key not in Globals.LANG_DICT: return False
			if eMail_content_LANG_DICT_key not in Globals.LANG_DICT: return False

			content_JSON = content_JSON if isinstance(content_JSON, dict) else {}

			try: subject = Globals.LANG_DICT[eMail_subject_LANG_DICT_key]["en"].format(sender=sender, recipient=recipient, content_TEXT=content_TEXT, **content_JSON)
			except Exception as e:
				Log.error(f"Notifications.new_eMail()->subject: {e}")
				return False

			try: content = Globals.LANG_DICT[eMail_content_LANG_DICT_key]["en"].format(sender=sender, recipient=recipient, content_TEXT=content_TEXT, **content_JSON)
			except Exception as e:
				Log.error(f"Notifications.new_eMail()->content: {e}")
				return False

			SendGrid.send("noreply", recipient, content, subject)

		@staticmethod
		def new_SMS(
			recipient,
			sender = None,
			content_TEXT = None,
			content_JSON = None,
			event_name = None
		):
			if recipient is None: return

			SMS_body_LANG_DICT_key = f"{event_name}_SMS_body"

			if SMS_body_LANG_DICT_key not in Globals.LANG_DICT: return False

			content_JSON = content_JSON if isinstance(content_JSON, dict) else {}

			try: content = Globals.LANG_DICT[SMS_body_LANG_DICT_key]["en"].format(recipient=recipient, sender=sender, content_TEXT=content_TEXT, **content_JSON)
			except Exception as e:
				Log.error(f"Notifications.new_SMS()->content: {e}")
				return False

			Twilio.send_sms(content, Globals.CONF["Twilio"]["alphanumeric_sender_id"], recipient)


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
					WHERE notifications.flag_deleted IS NULL AND notifications.recipient=%s
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
					WHERE notifications.flag_deleted IS NULL AND recipient=%s AND seen=0;
				""",
				params=[recipient],
				fetch_one=True
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
					WHERE notifications.id = %s AND notifications.flag_deleted IS NULL AND notifications.recipient=%s LIMIT 1;
				""",
				params=[ID, session['user']['id']],
				fetch_one=True
			)
			return data

		@staticmethod
		def set_seen(ID):
			data = MySQL.execute("UPDATE notifications SET seen=1 WHERE id=%s AND notifications.flag_deleted IS NULL;", [ID], commit=True)
			if data is False: return False
			return True

		@staticmethod
		def delete(ID):
			data = MySQL.execute(
				sql="UPDATE notifications SET flag_deleted = NOW(), flag_deleted_by_user = %s WHERE id=%s AND recipient=%s;",
				params=[session["user"]["id"], ID, session["user"]["id"]],
				commit=True
			)
			if data is False: return False
			return True
