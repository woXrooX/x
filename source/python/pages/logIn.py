from main import session
from python.modules.Page import Page
from python.modules.response import response
from python.modules.Globals import Globals
from python.modules.User import User
from python.modules.MySQL import MySQL


@Page.build()
def logIn(request):
	if request.method == "POST":
		# unknownError
		if request.form["for"] != "logIn":
			return response(type="warning", message="unknownError")

		######## eMail
		# eMailEmpty
		if "eMail" not in request.form or not request.form["eMail"]:
			return response(type="error", message="eMailEmpty", field="eMail")

		######## password
		# passwordEmpty
		if "password" not in request.form or not request.form["password"]:
			return response(type="error", message="passwordEmpty", field="password")

		######## Check If eMail And Password matching User Exist
		data = MySQL.execute(
			sql="SELECT id FROM users WHERE eMail=%s AND password=%s LIMIT 1;",
			params=(request.form["eMail"], request.form["password"]),
			fetchOne=True
		)

		if data is False: return response(type="error", message="databaseError")

		# No Match
		if not data: return response(type="error", message="usernameOrPasswordWrong")

		# Set Session User ID
		session["user"] = data

		# Handle The Session Update Error
		if not User.updateSession():
			pass

		# On Success Redirect & Update Front-End Session
		return response(
			type="success",
			message="success",
			setSessionUser=True,
			redirect="home",
			domChange=["menu"]
		)
