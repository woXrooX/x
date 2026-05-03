from main import session

from Python.x.modules.Page import Page
from Python.x.modules.Response import Response
from Python.x.modules.PostgreSQL import PostgreSQL
from Python.x.modules.Globals import Globals

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"authenticity_statuses": ["unauthorized", "authorized"],
# 	"endpoints": ["/x/notifications/settings"]
# })
@Page.build()
def x_notifications_settings(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_events": return Response.make(type="success", message="success", data=Globals.NOTIFICATION_EVENTS)

			if request.get_json()["for"] == "get_disabled_notification_events":
				res = PostgreSQL.execute(
					SQL="""
						SELECT
							"notification_events"."name",
							disabled_"notification_events"."method_in_app",
							disabled_"notification_events"."method_eMail",
							disabled_"notification_events"."method_SMS"
						FROM "disabled_notification_events"
						JOIN "notification_events" ON "notification_events"."id" = "disabled_notification_events"."event"
						WHERE "disabled_notification_events"."user" = %s;
					""",
					params=[session["user"]["id"]]
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="success", data=res["data"])

			if request.get_json()["for"] == "toggle_disabled_notification_event_method":
				if "event" not in request.get_json() or not request.get_json()["event"]: return Response.make(type="error", message="invalid_request")
				if request.get_json()["event"] not in Globals.NOTIFICATION_EVENTS: return Response.make(type="error", message="invalid_request")

				if "method" not in request.get_json() or not request.get_json()["method"]: return Response.make(type="error", message="invalid_request")

				sql = ''
				match request.get_json()["method"]:
					case "in_app":
						sql = """
							INSERT INTO "disabled_notification_events" ("user", "event", "method_in_app")
							VALUES (%s, %s, b'1')
							ON CONFLICT ON CONSTRAINT "unique_user_event" DO UPDATE
							SET "method_in_app" = "disabled_notification_events"."method_in_app" # b'1';
						"""

					case "eMail":
						sql = """
							INSERT INTO "disabled_notification_events" ("user", "event", "method_eMail")
							VALUES (%s, %s, b'1')
							ON CONFLICT ON CONSTRAINT "unique_user_event" DO UPDATE
							SET "method_eMail" = "disabled_notification_events"."method_eMail" # b'1';
						"""

					case "SMS":
						sql = """
							INSERT INTO "disabled_notification_events" ("user", "event", "method_SMS")
							VALUES (%s, %s, b'1')
							ON CONFLICT ON CONSTRAINT "unique_user_event" DO UPDATE
							SET "method_SMS" = "disabled_notification_events"."method_SMS" # b'1';
						"""

					case _: return Response.make(type="error", message="invalid_request")

				data = PostgreSQL.execute(
					SQL=sql,
					params=[
						session["user"]["id"],
						Globals.NOTIFICATION_EVENTS[request.get_json()["event"]]["id"]
					]
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="saved")
