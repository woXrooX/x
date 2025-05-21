from main import session

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.MySQL import MySQL
from Python.x.modules.Globals import Globals

@Page.build()
def x_notifications_settings(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_disabled_event_names":
				data = MySQL.execute(
					sql="""
						SELECT GROUP_CONCAT(notification_events.name SEPARATOR ', ') as disabled_event_names
						FROM notification_events
						LEFT JOIN disabled_notification_events ON disabled_notification_events.event = notification_events.id
						WHERE disabled_notification_events.user = %s;
					""",
					params=[session["user"]["id"]],
					fetch_one=True
				)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data["disabled_event_names"])

			if request.get_json()["for"] == "toggle_disabled_notification_event":
				if "event" not in request.get_json() or not request.get_json()["event"]: return response(type="error", message="invalid_request")
				if request.get_json()["event"] not in Globals.NOTIFICATION_EVENTS: return response(type="error", message="invalid_request")

				# Check if disabled
				is_disabled = MySQL.execute(
					sql="SELECT id FROM disabled_notification_events WHERE user = %s AND event = %s LIMIT 1;",
					params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
					fetch_one=True
				)
				if is_disabled is False: return response(type="error", message="database_error")

				# Disable
				if is_disabled is None:
					data = MySQL.execute(
						sql="INSERT INTO disabled_notification_events (user, event) VALUES (%s, %s);",
						params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
						commit=True
					)
					if data is False: return response(type="error", message="database_error")

				# Enable
				else:
					data = MySQL.execute(
						sql="DELETE FROM disabled_notification_events WHERE id = %s AND user = %s LIMIT 1;",
						params=[is_disabled["id"], session["user"]["id"]],
						commit=True
					)
					if data is False: return response(type="error", message="database_error")

				return response(type="success", message="saved")
