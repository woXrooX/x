from main import session

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.MySQL import MySQL
from Python.x.modules.Globals import Globals

from Python.x.modules.Notifications import Notifications

@Page.build()
def x_notifications_settings(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_disabled_events":
				data = MySQL.execute(
					sql="""
						SELECT
							notification_events.name AS event_name,
							disabled_notification_events.via_in_app,
							disabled_notification_events.via_eMail,
							disabled_notification_events.via_SMS
						FROM notification_events
						JOIN disabled_notification_events ON disabled_notification_events.event = notification_events.id
						WHERE disabled_notification_events.user = %s;
					""",
					params=[session["user"]["id"]]
				)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data)

			if request.get_json()["for"] == "toggle_via_in_app":
				if "event" not in request.get_json() or not request.get_json()["event"]: return response(type="error", message="invalid_request")
				if request.get_json()["event"] not in Globals.NOTIFICATION_EVENTS: return response(type="error", message="invalid_request")

				# Check if disabled
				is_disabled = MySQL.execute(
					sql="SELECT 1 FROM disabled_notification_events WHERE user = %s AND event = %s AND via_in_app = b'1' LIMIT 1;",
					params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
					fetch_one=True
				)
				if is_disabled is False: return response(type="error", message="database_error")

				# Disabled
				if is_disabled is None:
					data = MySQL.execute(
						sql="""
							INSERT INTO disabled_notification_events (user, event, via_in_app)
							VALUES (%s, %s, b'1')
							ON DUPLICATE KEY UPDATE via_in_app = VALUES(via_in_app);
						""",
						params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
						commit=True
					)
					if data is False: return response(type="error", message="database_error")

				else:
					data = MySQL.execute(
						sql="""
							INSERT INTO disabled_notification_events (user, event, via_in_app)
							VALUES (%s, %s, b'0')
							ON DUPLICATE KEY UPDATE via_in_app = VALUES(via_in_app);
						""",
						params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
						commit=True
					)
					if data is False: return response(type="error", message="database_error")

				return response(type="success", message="saved")

			if request.get_json()["for"] == "get_all_events": return response(type="success", message="success", data=Globals.NOTIFICATION_EVENTS)
			if request.get_json()["for"] == "toggle_via_eMail":
				if "event" not in request.get_json() or not request.get_json()["event"]: return response(type="error", message="invalid_request")
				if request.get_json()["event"] not in Globals.NOTIFICATION_EVENTS: return response(type="error", message="invalid_request")

				# Check if disabled
				is_disabled = MySQL.execute(
					sql="SELECT 1 FROM disabled_notification_events WHERE user = %s AND event = %s AND via_eMail = b'1' LIMIT 1;",
					params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
					fetch_one=True
				)
				if is_disabled is False: return response(type="error", message="database_error")

				# Disabled
				if is_disabled is None:
					data = MySQL.execute(
						sql="""
							INSERT INTO disabled_notification_events (user, event, via_eMail)
							VALUES (%s, %s, b'1')
							ON DUPLICATE KEY UPDATE via_eMail = VALUES(via_eMail);
						""",
						params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
						commit=True
					)
					if data is False: return response(type="error", message="database_error")

				else:
					data = MySQL.execute(
						sql="""
							INSERT INTO disabled_notification_events (user, event, via_eMail)
							VALUES (%s, %s, b'0')
							ON DUPLICATE KEY UPDATE via_eMail = VALUES(via_eMail);
						""",
						params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
						commit=True
					)
					if data is False: return response(type="error", message="database_error")

				return response(type="success", message="saved")

			if request.get_json()["for"] == "toggle_via_SMS":
				if "event" not in request.get_json() or not request.get_json()["event"]: return response(type="error", message="invalid_request")
				if request.get_json()["event"] not in Globals.NOTIFICATION_EVENTS: return response(type="error", message="invalid_request")

				# Check if disabled
				is_disabled = MySQL.execute(
					sql="SELECT 1 FROM disabled_notification_events WHERE user = %s AND event = %s AND via_SMS = b'1' LIMIT 1;",
					params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
					fetch_one=True
				)
				if is_disabled is False: return response(type="error", message="database_error")

				# Disabled
				if is_disabled is None:
					data = MySQL.execute(
						sql="""
							INSERT INTO disabled_notification_events (user, event, via_SMS)
							VALUES (%s, %s, b'1')
							ON DUPLICATE KEY UPDATE via_SMS = VALUES(via_SMS);
						""",
						params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
						commit=True
					)
					if data is False: return response(type="error", message="database_error")

				else:
					data = MySQL.execute(
						sql="""
							INSERT INTO disabled_notification_events (user, event, via_SMS)
							VALUES (%s, %s, b'0')
							ON DUPLICATE KEY UPDATE via_SMS = VALUES(via_SMS);
						""",
						params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
						commit=True
					)
					if data is False: return response(type="error", message="database_error")

				return response(type="success", message="saved")
