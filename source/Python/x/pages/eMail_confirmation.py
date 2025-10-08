from urllib.parse import unquote

from main import session

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.Globals import Globals
from Python.x.modules.User import User
from Python.x.modules.MySQL import MySQL

@Page.build({
	"enabled": False,
	"authenticity_statuses": ["unauthorized"],
	"methods": ["GET", "POST"],
	"endpoints": ["/eMail_confirmation"]
})
def eMail_confirmation(request):
	if request.method == "POST":
		# I/ data validations

		# Check if "for" neant to go to here
		if request.form["for"] != "eMail_confirmation": return response(type="warning", message="invalid_request")
		if "verification_code" not in request.form or not request.form["verification_code"]: return response(type="warning", message="eMail_confirmation_code_empty", field="verification_code")

		int_verification_code = int(request.form["verification_code"])

		# Check if verification code does not match then increment the counter
		if int_verification_code != session["user"]["eMail_verification_code"]:
			data = MySQL.execute(
				sql="UPDATE users SET eMail_verification_attempts_count=eMail_verification_attempts_count + 1 WHERE id = %s;",
				params=[session["user"]["id"]],
				commit=True
			)
			if data is False: return response(type="error", message="database_error")

			User.update_session()

			return response(type="warning", message="eMail_confirmation_code_did_not_match", field="verification_code")

		# Success | Match
		if int_verification_code == session["user"]["eMail_verification_code"]:
			data = MySQL.execute(
				sql="""
					UPDATE users SET
						eMail_verified = b'1',
						eMail_verification_attempts_count = eMail_verification_attempts_count + 1,
						authenticity_status = %s
					WHERE id = %s;
				""",
				params=[Globals.USER_AUTHENTICITY_STATUSES["authorized"]["id"], session["user"]["id"]],
				commit=True
			)
			if data is False: return response(type="error", message="database_error")

			User.update_session()

			redirect = unquote(request.args.get("redirect")) if "redirect" in request.args else "/"

			return response(
				type="success",
				message="eMail_verification_success",
				set_session_user=True,
				DOM_change=["menu"],
				redirect=redirect
			)

		return response(type="error", message="unknown_error")
