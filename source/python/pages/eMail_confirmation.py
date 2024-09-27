from urllib.parse import unquote

from main import session

from python.modules.Page import Page
from python.modules.response import response
from python.modules.Globals import Globals
from python.modules.User import User
from python.modules.MySQL import MySQL

@Page.build()
def eMail_confirmation(request):
	if request.method == "POST":
		# Check If "for" Meant To Go To Here
		if request.form["for"] != "eMail_confirmation": return response(type="warning", message="unknown_error")

		# Check For Existentance Of "verification_code"
		if(
			# If No "verification_code" Key In Request
			"verification_code" not in request.form or

			# Check If Verification Code Is Empty
			"verification_code" in request.form and request.form["verification_code"] == ''

		): return response(type="warning", message="eMail_confirmation_code_empty", field="verification_code")

		# Check If Verification Code Does Not Match Then Increment The Counter
		if int(request.form["verification_code"]) != session["user"]["eMail_verification_code"]:
			data = MySQL.execute(
				sql="""
					UPDATE users SET
						eMail_verification_attempts_count=eMail_verification_attempts_count+1
					WHERE id=%s
				""",
				params=(session["user"]["id"],),
				commit=True
			)

			if data is False: return response(type="error", message="database_error")

			# Update The session["user"] After The Changes To The Database
			User.update_session()

			return response(type="warning", message="eMail_confirmation_code_did_not_match", field="verification_code")


		# Success | Match
		if int(request.form["verification_code"]) == session["user"]["eMail_verification_code"]:
			data = MySQL.execute(
				sql="""
					UPDATE users SET
						eMail_verified=1,
						eMail_verification_attempts_count=eMail_verification_attempts_count+1,
						authenticity_status=%s
					WHERE id=%s
				""",
				params=(
					Globals.USER_AUTHENTICITY_STATUSES["authorized"]["id"],
					session["user"]["id"],
				),
				commit=True
			)

			if data is False: return response(type="error", message="database_error")

			# Update The session["user"] After The Changes To The Database
			User.update_session()

			redirect = unquote(request.args.get("redirect")) if "redirect" in request.args else "/home"

			return response(
				type="success",
				message="eMail_verification_success",
				set_session_user=True,
				dom_change=["menu"],
				redirect=redirect
			)
