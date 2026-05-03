from main import session

from Python.x.modules.Page import Page
from Python.x.modules.PostgreSQL import PostgreSQL
from Python.x.modules.Response import Response

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"endpoints": ["/x/feedbacks"]
# })
@Page.build()
def x_feedbacks(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_feedbacks":
				res = PostgreSQL.execute("""
					SELECT
						"feedbacks".*,
						CONCAT("users"."first_name", ' ', "users"."last_name") AS "users_full_name",
						"users"."eMail" AS "users_eMail"
					FROM "feedbacks"
					LEFT JOIN "users" ON "users"."id" = "feedbacks"."created_by_user"
					WHERE "feedbacks"."flag_deleted_at" IS NULL;
				""")
				if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="success", data=res["data"], default_serializer_func=str)

			if request.get_json()["for"] == "delete":
				if "id" not in request.get_json(): return Response.make(type="error",message="invalid_request")

				res = PostgreSQL.execute(
					SQL="""
						UPDATE "feedbacks"
						SET
							"feedbacks"."flag_deleted_at" = NOW(),
							"feedbacks"."flag_deleted_by_user" = %s
						WHERE
							"feedbacks"."id" = %s AND
							"feedbacks"."flag_deleted_at" IS NULL
						LIMIT 1;
					""",
					params=[
						session["user"]["id"],
						request.get_json()["id"]
					]
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="deleted", DOM_change=["main"])
