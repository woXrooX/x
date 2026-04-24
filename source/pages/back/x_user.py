import random

from Python.x.modules.Page import Page
from Python.x.modules.Response import Response
from Python.x.modules.PostgreSQL import PostgreSQL
from Python.x.modules.User import User
from Python.x.modules.Notifications import Notifications
from Python.x.modules.Globals import Globals

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"roles": ["root"],
# 	"endpoints": ["/x/user/<id>"]
# })
@Page.build()
def x_user(request, id):
	if request.method == "POST":
		if "multipart/form-data" in request.content_type.split(';'):
			if request.form["for"] == "update_roles":
				roles = request.form.getlist("roles") if "roles" in request.form and request.form["roles"] else []

				# Prep the params
				params = []
				for role in roles:
					if role in Globals.USER_ROLES:
						params.append((id, Globals.USER_ROLES[role]["id"]))

				# Delete all old user roles
				res = PostgreSQL.execute(
					SQL="""DELETE FROM "users_roles" WHERE "user" = %s;""",
					params=[id]
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				if len(params) > 0:
					res = PostgreSQL.execute(
						SQL="""INSERT INTO "users_roles" ("user", "role") VALUES (%s, %s);""",
						params=params,
						execute_many=True
					)
					if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="saved", DOM_change=["main"])

		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_user":
				res = PostgreSQL.execute(
					SQL="""
						SELECT
							"users".*,
							STRING_AGG(DISTINCT "user_roles"."name", ', ' ORDER BY "user_roles"."name" ASC) AS "roles_list"
						FROM "users"
						LEFT JOIN "users_roles" ON "users"."id" = "users_roles"."user"
						LEFT JOIN "user_roles" ON "user_roles"."id" = "users_roles"."role"
						WHERE "users"."id" = %s
						GROUP BY "users"."id"
						LIMIT 1;
					""",
					params=[id],
					fetch_type="one"
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="success", data=res["data"], default_serializer_func=str)

			if request.get_json()["for"] == "get_user_roles": return Response.make(type="success", message="success", data=Globals.USER_ROLES)

			if request.get_json()["for"] == "get_user_log_in_records":
				res = PostgreSQL.execute(
					SQL="""
						SELECT
							"IP_address",
							"user_agent",
							"metadata_created_at"
						FROM "log_in_records"
						WHERE "user" = %s;
					""",
					params=[id]
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="success", data=res["data"], default_serializer_func=str)

			if request.get_json()["for"] == "delete_user":
				if User.soft_delete(id) is not True: return Response.make(type="warning", message="could_not_delete", DOM_change=["main"])

				return Response.make(type="success", message="deleted", redirect="/x/users")

			if request.get_json()["for"] == "resend_eMail_confirmation":
				user = PostgreSQL.execute(
					SQL="""
						SELECT "eMail", "eMail_verified"
						FROM "users"
						WHERE "id" = %s
						LIMIT 1;
					""",
					params=[id],
					fetch_type="one"
				)
				if "error" in user: return Response.make(type="error", message="database_error")
				if user["data"] is None: return Response.make(type="error", message="database_error")
				if user["data"]["eMail"] is None: return Response.make(type="warning", message="This user has no eMail address")
				if user["data"]["eMail_verified"] == 1: return Response.make(type="info", message="Email is already verified")

				eMail_verification_code = random.randint(100000, 999999)

				res = PostgreSQL.execute(
					SQL="""
						UPDATE "users"
						SET
							"eMail_verification_code" = %s,
							"eMail_verification_attempts_count" = 0,
							"authenticity_status" = 2
						WHERE
							"id" = %s AND
							"flag_deleted_at" IS NULL
						LIMIT 1;
					""",
					params=[eMail_verification_code, id]
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				if Notifications.new_eMail(
					recipient=user["data"],
					content_JSON={"eMail_verification_code": eMail_verification_code},
					event_name="sign_up_eMail_verification"
				) is not True: return Response.make(type="error", message="could_not_send_eMail_verification_code")

				return Response.make(type="success", message="eMail_confirmation_code_has_been_sent")
