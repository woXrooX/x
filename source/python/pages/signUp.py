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
		# unknownError
		if request.form["for"] != "signUp": return response(type="warning", message="unknownError")

		######## eMail
		# eMailEmpty
		if "eMail" not in request.form or not request.form["eMail"]: return response(type="error", message="eMailEmpty", field="eMail")

		# eMailInvalid
		if not re.match(Globals.CONF["eMail"]["regEx"], request.form["eMail"]): return response(type="error", message="eMailInvalid", field="eMail")

		######## password
		# passwordEmpty
		if "password" not in request.form or not request.form["password"]: return response(type="error", message="passwordEmpty", field="password")

		# passwordMinLength
		if len(request.form["password"]) < Globals.CONF["password"]["min_length"]: return response(type="error", message="passwordMinLength", field="password")

		# passwordMaxLength
		if len(request.form["password"]) > Globals.CONF["password"]["max_length"]: return response(type="error", message="passwordMaxLength", field="password")

		# passwordAllowedChars
		if not re.match(Globals.CONF["password"]["regEx"], request.form["password"]): return response(type="error", message="passwordAllowedChars", field="password")

		######## eMail and Password In Use
		# eMailInUse
		data = MySQL.execute(sql="SELECT id FROM users WHERE eMail=%s", params=(request.form["eMail"], ), fetchOne=True)
		if data: return response(type="error", message="eMailInUse", field="eMail")

		######## Success
		# Generate Randome Verification Code
		eMailVerificationCode = random.randint(100000, 999999)

		password = LogInTools.passwordHash(request.form["password"])

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
		if data is False: return response(type="error", message="databaseError")

		# Get User Data
		data = MySQL.execute(
			sql="SELECT id FROM users WHERE eMail=%s AND password=%s LIMIT 1;",
			params=(
				request.form["eMail"],
				password
			),
			fetchOne=True
		)
		if not data: return response(type="error", message="databaseError")

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
			message="eMailConfirmationCodeHasBeenSent" if emailVerificationSentSuccessfully is True else "Signed Up Without Email Verification!",
			setSessionUser=True,
			redirect="/eMailConfirmation" if emailVerificationSentSuccessfully is True else "/home",
			domChange=["menu"]
		)
