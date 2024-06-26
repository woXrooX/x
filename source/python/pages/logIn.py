from main import session

from python.modules.Page import Page
from python.modules.response import response
from python.modules.User import User
from python.modules.MySQL import MySQL
from python.modules.LogInTools import LogInTools


@Page.build()
def logIn(request):
	if request.method == "POST":
		# unknown_error
		if request.form["for"] != "log_in": return response(type="warning", message="unknown_error")

		######## eMail
		# eMail_empty
		if "eMail" not in request.form or not request.form["eMail"]: return response(type="error", message="eMail_empty", field="eMail")

		######## password
		# password_empty
		if "password" not in request.form or not request.form["password"]: return response(type="error", message="password_empty", field="password")

		password = LogInTools.password_hash(request.form["password"])

		######## Check If eMail And Password matching User Exist
		data = MySQL.execute(
			sql="SELECT id FROM users WHERE eMail=%s AND password=%s LIMIT 1;",
			params=(request.form["eMail"], password),
			fetchOne=True
		)

		if data is False: return response(type="error", message="database_error")

		# No Match
		if not data:
			LogInTools.new_record(request.remote_addr, request.headers.get('User-Agent'))
			return response(type="error", message="eMail_or_password_incorrect")

		# Set Session User ID
		session["user"] = data

		# Handle The Session Update Error
		if not User.update_session(): pass

		#### On Success Redirect & Update Front-End Session & Adds a new login record if enabled

		LogInTools.new_record(request.remote_addr, request.headers.get('User-Agent'), True)

		try:
			from python.modules.onLogIn import onLogIn
			onLogIn()

		except ModuleNotFoundError: pass

		return response(
			type="success",
			message="success",
			setSessionUser=True,
			redirect="/home",
			domChange=["menu"]
		)
