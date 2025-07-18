if __name__ != "__main__":
	import json

	from main import session
	from Python.x.modules.Globals import Globals
	from Python.x.modules.MySQL import MySQL
	from Python.x.modules.SendGrid import SendGrid
	from Python.x.modules.Twilio import Twilio
	from Python.x.modules.Logger import Log

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
			# Validate "event_name"
			if event_name not in Globals.NOTIFICATION_EVENTS:
				Log.warning(f"Notifications.new() -> Event does not exist: {event_name}")
				return False

			# 1. Validate "recipient"
			# 2. Get "recipient" infos
			# 3. Check if "recipient" disabled the "event_name"
			recipient = MySQL.execute(
				sql="""
					SELECT
						users.id,
						users.eMail,
						users.phone_number,
						disabled_notification_events.via_in_app,
						disabled_notification_events.via_eMail,
						disabled_notification_events.via_SMS
					FROM users
					LEFT JOIN disabled_notification_events ON
						disabled_notification_events.event = %s AND
						disabled_notification_events.user = users.id
					WHERE users.id = %s LIMIT 1;
				""",
				params = [
					Globals.NOTIFICATION_EVENTS[event_name]["id"],
					recipient
				],
				fetch_one = True
			)
			if recipient is False or recipient is None: return False

			is_successfully = True

			if via_in_app is True:
				if Notifications.new_in_app(recipient, sender, content_TEXT, content_JSON, event_name, type_name) is False:
					Log.warning("Notifications.new() -> Could not create: new_in_app()")
					is_successfully = False

			if via_eMail is True:
				if Notifications.new_eMail(recipient, sender, content_TEXT, content_JSON, event_name) is False:
					Log.warning("Notifications.new() -> Could not send: new_eMail()")
					is_successfully = False

			if via_SMS is True:
				if Notifications.new_SMS(recipient, sender, content_TEXT, content_JSON, event_name) is False:
					Log.warning("Notifications.new() -> Could not send: new_SMS()")
					is_successfully = False

			return is_successfully

		#### Helpers
		# Creates a notifications using Notifications.new() for any type of notification.
		# Notifications.new() method validates whether notifications for the current event_name is enabled before sending.

		@staticmethod
		def new_in_app(
			recipient,
			sender = None,
			content_TEXT = None,
			content_JSON = None,
			event_name = None,
			type_name = None
		):
			if "via_in_app" in recipient and recipient["via_in_app"] == 1: return True

			data = MySQL.execute(
				sql="INSERT INTO notifications (sender, recipient, content_TEXT, content_JSON, event, type) VALUES (%s, %s, %s, %s, %s, %s);",
				params=[
					sender,
					recipient["id"],
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
			if "via_eMail" in recipient and recipient["via_eMail"] == 1: return True

			if recipient["eMail"] is None: return False

			eMail_subject_LANGUAGE_DICTIONARY_key = f"{event_name}_eMail_subject"
			eMail_content_LANGUAGE_DICTIONARY_key = f"{event_name}_eMail_content"


			if eMail_subject_LANGUAGE_DICTIONARY_key not in Globals.LANGUAGE_DICTIONARY: return False
			if eMail_content_LANGUAGE_DICTIONARY_key not in Globals.LANGUAGE_DICTIONARY: return False

			content_JSON = content_JSON if isinstance(content_JSON, dict) else {}

			try: subject = Globals.LANGUAGE_DICTIONARY[eMail_subject_LANGUAGE_DICTIONARY_key]["en"].format(sender=sender, recipient=recipient["eMail"], content_TEXT=content_TEXT, **content_JSON)
			except Exception as e:
				Log.error(f"Notifications.new_eMail()->subject: {e}")
				return False

			try: content = Globals.LANGUAGE_DICTIONARY[eMail_content_LANGUAGE_DICTIONARY_key]["en"].format(sender=sender, recipient=recipient["eMail"], content_TEXT=content_TEXT, **content_JSON)
			except Exception as e:
				Log.error(f"Notifications.new_eMail()->content: {e}")
				return False

			return SendGrid.send("noreply", recipient["eMail"], content, subject)

		@staticmethod
		def new_SMS(
			recipient,
			sender = None,
			content_TEXT = None,
			content_JSON = None,
			event_name = None
		):
			if "via_SMS" in recipient and recipient["via_SMS"] == 1: return True

			if recipient["phone_number"] is None: return

			SMS_body_LANGUAGE_DICTIONARY_key = f"{event_name}_SMS_body"

			if SMS_body_LANGUAGE_DICTIONARY_key not in Globals.LANGUAGE_DICTIONARY: return False

			content_JSON = content_JSON if isinstance(content_JSON, dict) else {}

			try: content = Globals.LANGUAGE_DICTIONARY[SMS_body_LANGUAGE_DICTIONARY_key]["en"].format(recipient=recipient["phone_number"], sender=sender, content_TEXT=content_TEXT, **content_JSON)
			except Exception as e:
				Log.error(f"Notifications.new_SMS()->content: {e}")
				return False

			Twilio.send_sms(content, Globals.CONF["Twilio"]["alphanumeric_sender_id"], recipient["phone_number"])
