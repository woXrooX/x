from main import session

from python.modules.Page import Page
from python.modules.response import response
from python.modules.User import User
from python.modules.MySQL import MySQL
from python.modules.LogInTools import LogInTools


@Page.build()
def logIn(request):
	if request.method == "POST":
		# unknownError
		if request.form["for"] != "logIn": return response(type="warning", message="unknownError")

		######## eMail
		# eMailEmpty
		if "eMail" not in request.form or not request.form["eMail"]: return response(type="error", message="eMailEmpty", field="eMail")

		######## password
		# passwordEmpty
		if "password" not in request.form or not request.form["password"]: return response(type="error", message="passwordEmpty", field="password")

		password = LogInTools.passwordHash(request.form["password"])

		######## Check If eMail And Password matching User Exist
		data = MySQL.execute(
			sql="SELECT id FROM users WHERE eMail=%s AND password=%s LIMIT 1;",
			params=(request.form["eMail"], password),
			fetchOne=True
		)

		if data is False: return response(type="error", message="databaseError")

		# No Match
		if not data:
			LogInTools.newRecord(request.remote_addr, request.headers.get('User-Agent'))
			return response(type="error", message="usernameOrPasswordWrong")

		# Set Session User ID
		session["user"] = data

		# Handle The Session Update Error
		if not User.updateSession(): pass

		#### On Success Redirect & Update Front-End Session & Adds a new login record if enabled

		LogInTools.newRecord(request.remote_addr, request.headers.get('User-Agent'), True)

		return response(
			type="success",
			message="success",
			setSessionUser=True,
			redirect="/home",
			domChange=["menu"]
		)
