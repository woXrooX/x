from main import session

from Python.x.modules.Page import Page
from Python.x.modules.Response import Response
from Python.x.modules.PostgreSQL import PostgreSQL

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"authenticity_statuses": ["unauthorized", "authorized"],
# 	"endpoints": ["/x/notification/<id>"]
# })
@Page.build()
def x_notification(request, id):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_notification":
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
							"notifications"."id" = %s AND
							"notifications"."flag_deleted_at" IS NULL AND
							"notifications"."recipient" = %s
						LIMIT 1;
					""",
					params=[id, session['user']['id']],
					fetch_type="one"
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				if res["data"] is not None:
					PostgreSQL.execute(
						SQL="""
							UPDATE "notifications"
							SET "seen" = 1
							WHERE
								"id" = %s AND
								"notifications"."flag_deleted_at" IS NULL;
						""",
						params=[id]
					)

				return Response.make(type="success", message="success", data=res["data"], default_serializer_func=str)

			if request.get_json()["for"] == "delete_notification":
				res = PostgreSQL.execute(
					SQL="""
						UPDATE "notifications"
						SET
							"flag_deleted_at" = NOW(),
							"flag_deleted_by_user" = %s
						WHERE
							"id" = %s AND
							"recipient" = %s;
					""",
					params=[
						session["user"]["id"],
						id,
						session["user"]["id"]
					]
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="deleted", redirect="/x/notifications")
