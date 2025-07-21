from main import session

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.MySQL import MySQL
from Python.x.modules.Globals import Globals

@Page.build()
def x_notifications_settings(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_disabled_events":
				data = MySQL.execute(
					sql="""
						SELECT
							notification_events.name,
							disabled_notification_events.via_in_app,
							disabled_notification_events.via_eMail,
							disabled_notification_events.via_SMS
						FROM disabled_notification_events
						JOIN notification_events ON notification_events.id = disabled_notification_events.event
						WHERE disabled_notification_events.user = %s;
					""",
					params=[session["user"]["id"]]
				)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data)

			if request.get_json()["for"] == "toggle_notification_method":
				if "event" not in request.get_json() or not request.get_json()["event"]: return response(type="error", message="invalid_request")
				if request.get_json()["event"] not in Globals.NOTIFICATION_EVENTS: return response(type="error", message="invalid_request")

				if "method" not in request.get_json() or not request.get_json()["method"]: return response(type="error", message="invalid_request")

				sql = ''
				match request.get_json()["method"]:
					case "in_app":
						sql = """
							INSERT INTO disabled_notification_events (user, event, via_in_app) VALUES (%s, %s, b'1')
							ON DUPLICATE KEY UPDATE via_in_app = via_in_app ^ b'1';
						"""
					case "eMail":
						sql = """
							INSERT INTO disabled_notification_events (user, event, via_eMail) VALUES (%s, %s, b'1')
							ON DUPLICATE KEY UPDATE via_eMail = via_eMail ^ b'1';
						"""
					case "SMS":
						sql = """
							INSERT INTO disabled_notification_events (user, event, via_SMS) VALUES (%s, %s, b'1')
							ON DUPLICATE KEY UPDATE via_SMS = via_SMS ^ b'1';
						"""
					case _:
						return response(type="error", message="invalid_request")

				data = MySQL.execute(
					sql=sql,
					params=[session["user"]["id"], Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]],
					commit=True
				)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="saved")

			if request.get_json()["for"] == "get_all_events": return response(type="success", message="success", data=Globals.NOTIFICATION_EVENTS)
