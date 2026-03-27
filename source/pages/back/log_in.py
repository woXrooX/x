from urllib.parse import unquote

from main import session

from Python.x.modules.Page import Page
from Python.x.modules.Response import Response
from Python.x.modules.User import User
from Python.x.modules.MySQL import MySQL
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
		# unknown_error
		if request.form["for"] != "log_in": return Response.make(type="warning", message="unknown_error")

		######## eMail
		# eMail_empty
		if "eMail" not in request.form or not request.form["eMail"]: return Response.make(type="error", message="eMail_empty", field="eMail")

		######## password
		# password_empty
		if "password" not in request.form or not request.form["password"]: return Response.make(type="error", message="password_empty", field="password")

		password = Log_In_Tools.password_hash(request.form["password"])

		######## Check If eMail And Password matching User Exist
		data = MySQL.execute(
			sql="SELECT id FROM users WHERE eMail=%s AND password=%s AND flag_deleted IS NULL LIMIT 1;",
			params=[request.form["eMail"], password],
			fetch_one=True
		)

		if data is False: return Response.make(type="error", message="database_error")

		# No Match
		if not data:
			Log_In_Tools.new_record(request, "eMail_or_password_incorrect")
			return Response.make(type="error", message="eMail_or_password_incorrect")

		# Set Session User ID
		session["user"] = data
		session.permanent = True

		# Handle The Session Update Error
		if not User.update_session(): pass

		#### On Success Redirect & Update Front-End Session & Adds a new login record if enabled

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
			DOM_change=["menu"],
			redirect= redirect
		)
