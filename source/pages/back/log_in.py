from urllib.parse import unquote

from main import session

from Python.x.modules.Page import Page
from Python.x.modules.Response import Response
from Python.x.modules.User import User
from Python.x.modules.PostgreSQL import PostgreSQL
from Python.x.modules.Log_In_Tools import Log_In_Tools
from Python.x.modules.Logger import Log

# @Page.build({
# 	"enabled": False,
# 	"endpoints": ["/log_in"],
# 	"authenticity_statuses": ["unauthenticated"],
# 	"methods": ["GET", "POST"]
# })
@Page.build()
def log_in(request):
	if request.method == "POST":
		if request.form["for"] == "log_in":
			identifier_type = None

			#### eMail or phone_number
			eMail_or_phone_number = None

			if "eMail_or_phone_number" not in request.form or not request.form["eMail_or_phone_number"]:
				return Response.make(type="error", message="invalid_value", field="eMail_or_phone_number")

			eMail_or_phone_number = request.form["eMail_or_phone_number"]

			if '@' in eMail_or_phone_number: identifier_type = "eMail"
			else: identifier_type = "phone_number"



			#### password

			if "password" not in request.form or not request.form["password"]: return Response.make(type="error", message="password_empty", field="password")

			password = Log_In_Tools.password_hash(request.form["password"])




			match_res = None

			if identifier_type == "eMail":
				match_res = PostgreSQL.execute(
					SQL="""
						SELECT "id"

						FROM "users"

						WHERE
							"eMail" = %s AND
							"password" = %s AND
							"flag_deleted_at" IS NULL

						LIMIT 1;
					""",
					params=[
						eMail_or_phone_number,
						password
					],
					fetch_type="one"
				)

			else:
				match_res = PostgreSQL.execute(
					SQL="""
						SELECT "id"

						FROM "users"

						WHERE
							"phone_number" = %s AND
							"password" = %s AND
							"flag_deleted_at" IS NULL

						LIMIT 1;
					""",
					params=[
						eMail_or_phone_number,
						password
					],
					fetch_type="one"
				)


			if "error" in match_res: return Response.make(type="error", message="database_error")

			# No match
			if not match_res["data"]:
				Log_In_Tools.new_record(request, "eMail_or_phone_number_or_password_incorrect")
				Log_In_Tools.log_failed_log_in(request)

				return Response.make(type="error", message="eMail_or_phone_number_or_password_incorrect")



			#### Session

			session["user"] = match_res["data"]
			session.permanent = True

			if not User.update_session(): pass



			Log_In_Tools.new_record(request, "success")



			try:
				from Python.project.modules.on_log_in import on_log_in
				on_log_in()

			except Exception as err: Log.warning(f"log_in.py->on_log_in(): {err}")



			redirect = unquote(request.args.get("redirect")) if "redirect" in request.args else "/"



			return Response.make(
				type="success",
				message="success",
				set_session_user=True,
				redirect=redirect,
				DOM_change=["all"]
			)
