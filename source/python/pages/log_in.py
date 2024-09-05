from main import session

from python.modules.Page import Page
from python.modules.response import response
from python.modules.User import User
from python.modules.MySQL import MySQL
from python.modules.Log_In_Tools import Log_In_Tools
from urllib.parse import unquote


@Page.build()
def log_in(request):
	if request.method == "POST":
		# unknown_error
		if request.form["for"] != "log_in": return response(type="warning", message="unknown_error")

		######## eMail
		# eMail_empty
		if "eMail" not in request.form or not request.form["eMail"]: return response(type="error", message="eMail_empty", field="eMail")

		######## password
		# password_empty
		if "password" not in request.form or not request.form["password"]: return response(type="error", message="password_empty", field="password")

		password = Log_In_Tools.password_hash(request.form["password"])

		######## Check If eMail And Password matching User Exist
		data = MySQL.execute(
			sql="SELECT id FROM users WHERE eMail=%s AND password=%s LIMIT 1;",
			params=(request.form["eMail"], password),
			fetch_one=True
		)

		if data is False: return response(type="error", message="database_error")

		# No Match
		if not data:
			Log_In_Tools.new_record(request, "eMail_or_password_incorrect")
			return response(type="error", message="eMail_or_password_incorrect")

		# Set Session User ID
		session["user"] = data
		session.permanent = True

		# Handle The Session Update Error
		if not User.update_session(): pass

		#### On Success Redirect & Update Front-End Session & Adds a new login record if enabled

		Log_In_Tools.new_record(request, "success")

		try:
			from python.modules.on_log_in import on_log_in
			on_log_in()

		except ModuleNotFoundError: pass

		redirect = unquote(request.args.get("redirect")) if "redirect" in request.args else "/home"

		return response(
			type="success",
			message="success",
			set_session_user=True,
			redirect= redirect,
			dom_change=["menu"]
		)
