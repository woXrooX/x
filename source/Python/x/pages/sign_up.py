import re, random

from main import session

from Python.x.modules.Page import Page
from Python.x.modules.Notifications import Notifications
from Python.x.modules.response import response
from Python.x.modules.Globals import Globals
from Python.x.modules.Log_In_Tools import Log_In_Tools
from Python.x.modules.User import User
from Python.x.modules.MySQL import MySQL
from Python.x.modules.Logger import Log

@Page.build()
def sign_up(request):
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
		data = MySQL.execute(sql="SELECT id FROM users WHERE eMail=%s LIMIT 1;", params=[request.form["eMail"]], fetch_one=True)
		if data: return response(type="error", message="eMail_in_use", field="eMail")

		######## Success
		# Generate Randome Verification Code
		eMail_verification_code = random.randint(100000, 999999)

		password = Log_In_Tools.password_hash(request.form["password"])

		# Insert to database
		data = MySQL.execute(
			sql="INSERT INTO users (password, eMail, eMail_verification_code, authenticity_status) VALUES (%s, %s, %s, %s);",
			params=[
				password,
				request.form["eMail"],
				eMail_verification_code,
				Globals.USER_AUTHENTICITY_STATUSES["unauthorized"]["id"]
			],
			commit=True
		)
		if data is False: return response(type="error", message="database_error")

		# Get user data
		user_data = MySQL.execute(
			sql="SELECT id, eMail FROM users WHERE eMail=%s AND password=%s LIMIT 1;",
			params=[
				request.form["eMail"],
				password
			],
			fetch_one=True
		)
		if not user_data: return response(type="error", message="database_error")

		# Set session user data
		session["user"] = user_data
		session.permanent = True

		# Handle the session update error
		if not User.update_session(): Log.warning("sign_up.py->User.update_session()")

		#### Setup Dirs
		# Handle Folder Creation Errors
		if not User.init_folders(): Log.warning("sign_up.py->User.init_folders()")

		#### Check if verification code sent successfully
		email_verification_sent_status = Notifications.new_eMail(
			recipient=user_data,
			content_JSON={"eMail_verification_code": eMail_verification_code},
			event_name="sign_up_eMail_verification",
		)

		try:
			from Python.project.modules.on_sign_up import on_sign_up
			on_sign_up()

		except Exception as err: Log.warning(f"sign_up.py->on_sign_up(): {err}")

		# Success
		Log_In_Tools.new_record(request, "success")

		return response(
			type = "success" if email_verification_sent_status is True else "info",
			message = "eMail_confirmation_code_has_been_sent" if email_verification_sent_status is True else "Signed up but could not send email verification code. Please contact support!",
			set_session_user = True,
			redirect = "/eMail_confirmation" if email_verification_sent_status is True else "/",
			DOM_change = ["menu"]
		)
