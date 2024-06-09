import re, random

from main import session

from python.modules.Page import Page
from python.modules.SendGrid import SendGrid
from python.modules.response import response
from python.modules.Globals import Globals
from python.modules.LogInTools import LogInTools
from python.modules.User import User
from python.modules.MySQL import MySQL


@Page.build()
def signUp(request):
	if request.method == "POST":
		# unknown_error
		if request.form["for"] != "sign_up": return response(type="warning", message="unknown_error")

		######## eMail
		# eMail_empty
		if "eMail" not in request.form or not request.form["eMail"]: return response(type="error", message="eMail_empty", field="eMail")

		# eMail_invalid
		if not re.match(Globals.CONF["eMail"]["regEx"], request.form["eMail"]): return response(type="error", message="eMail_invalid", field="eMail")

		######## password
		# password_empty
		if "password" not in request.form or not request.form["password"]: return response(type="error", message="password_empty", field="password")

		# password_min_length
		if len(request.form["password"]) < Globals.CONF["password"]["min_length"]: return response(type="error", message="password_min_length", field="password")

		# password_max_length
		if len(request.form["password"]) > Globals.CONF["password"]["max_length"]: return response(type="error", message="password_max_length", field="password")

		# password_allowed_chars
		if not re.match(Globals.CONF["password"]["regEx"], request.form["password"]): return response(type="error", message="password_allowed_chars", field="password")

		# eMail_in_use
		data = MySQL.execute(sql="SELECT id FROM users WHERE eMail=%s", params=(request.form["eMail"], ), fetchOne=True)
		if data: return response(type="error", message="eMail_in_use", field="eMail")

		######## Success
		# Generate Randome Verification Code
		eMailVerificationCode = random.randint(100000, 999999)

		password = LogInTools.password_hash(request.form["password"])

		# Insert To Database
		data = MySQL.execute(
			sql="INSERT INTO users (password, eMail, eMail_verification_code, authenticity_status) VALUES (%s, %s, %s, %s)",
			params=(
				password,
				request.form["eMail"],
				eMailVerificationCode,
				Globals.USER_AUTHENTICITY_STATUSES["unauthorized"]["id"]
			),
			commit=True
		)
		if data is False: return response(type="error", message="database_error")

		# Get User Data
		data = MySQL.execute(
			sql="SELECT id FROM users WHERE eMail=%s AND password=%s LIMIT 1;",
			params=(
				request.form["eMail"],
				password
			),
			fetchOne=True
		)
		if not data: return response(type="error", message="database_error")

		# Set Session User Data
		session["user"] = data

		# Handle The Session Update Error
		if not User.update_session(): pass

		#### Setup Dirs
		# Handle Folder Creation Errors
		if not User.init_folders(): pass

		#### Check If Verification Code Sent Successfully
		emailVerificationSentSuccessfully = SendGrid.send("noreply", request.form["eMail"], eMailVerificationCode, "Sign Up")

		try:
			from python.modules.onSignUp import onSignUp
			onSignUp()

		except ModuleNotFoundError: pass

		# Success
		return response(
			type="success" if emailVerificationSentSuccessfully is True else "info",
			message="eMail_confirmation_code_has_been_sent" if emailVerificationSentSuccessfully is True else "Signed Up Without Email Verification!",
			setSessionUser=True,
			redirect="/eMailConfirmation" if emailVerificationSentSuccessfully is True else "/home",
			domChange=["menu"]
		)
