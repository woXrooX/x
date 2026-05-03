from main import session

from Python.x.modules.Page import Page
from Python.x.modules.Response import Response
from Python.x.modules.PostgreSQL import PostgreSQL
import time

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"authenticity_statuses": ["unauthorized", "authorized"],
# 	"endpoints": ["/x/notifications"]
# })
@Page.build()
def x_notifications(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_notifications":
				res = PostgreSQL.execute(
					SQL="""
						SELECT
							"notifications".*,
							"notification_events"."name" as "event",
							"notification_types"."name" as "type"
						FROM "notifications"
						LEFT JOIN "notification_events" ON "notification_events"."id" = "notifications"."event"
						LEFT JOIN "notification_types" ON "notification_types"."id" = "notifications"."type"
						WHERE
							"notifications"."flag_deleted_at" IS NULL AND
							"notifications"."recipient" = %s
						ORDER BY "metadata_created_at" DESC;
					""",
					params=[session['user']['id']]
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="success", data=res["data"], default_serializer_func=str)

			if request.get_json()["for"] == "get_unseen_count":
				res = PostgreSQL.execute(
					SQL="""
						SELECT COUNT(*) AS "unseen_notifications_count"
						FROM "notifications"
						WHERE
							"notifications"."flag_deleted_at" IS NULL AND
							"recipient" = %s AND
							"seen" = b'0';
					""",
					params=[session['user']['id']],
					fetch_type="one"
				)
				if "error" in res: return Response.make(type="error", message="database_error")
				if "unseen_notifications_count" in res["data"]: return Response.make(type="success", message="success", data=res["data"]["unseen_notifications_count"])

				return Response.make(type="success", message="success")

			if request.get_json()["for"] == "delete_all_notifications":
				res = PostgreSQL.execute(
					SQL="""
						UPDATE "notifications"
						SET
							"flag_deleted_at" = NOW(),
							"flag_deleted_by_user" = %s
						WHERE "recipient"=%s;
					""",
					params=[
						session["user"]["id"],
						session["user"]["id"]
					],
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="deleted", DOM_change=["main"])

