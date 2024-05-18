from main import session
from python.modules.Page import Page
from python.modules.response import response
from python.modules.Globals import Globals
from python.modules.User import User
from python.modules.MySQL import MySQL

@Page.build()
def eMailConfirmation(request):
	if request.method == "POST":
		# Check If "for" Meant To Go To Here
		if request.form["for"] != "eMailConfirmation": return response(type="warning", message="unknownError")

		# Check For Existentance Of "verificationCode"
		if(
			# If No "verificationCode" Key In Request
			"verificationCode" not in request.form or

			# Check If Verification Code Is Empty
			"verificationCode" in request.form and request.form["verificationCode"] == ''

		): return response(type="warning", message="eMailConfirmationCodeEmpty", field="verificationCode")

		# Check If Verification Code Does Not Match Then Increment The Counter
		if int(request.form["verificationCode"]) != session["user"]["eMail_verification_code"]:
			data = MySQL.execute(
				sql="""
					UPDATE users SET
						eMail_verification_attempts_count=eMail_verification_attempts_count+1
					WHERE id=%s
				""",
				params=(session["user"]["id"],),
				commit=True
			)

			if data is False: return response(type="error", message="databaseError")

			# Update The session["user"] After The Changes To The Database
			User.update_session()

			return response(type="warning", message="eMailConfirmationCodeDidNotMatch", field="verificationCode")


		# Success | Match
		if int(request.form["verificationCode"]) == session["user"]["eMail_verification_code"]:
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

			if data is False: return response(type="error", message="databaseError")

			# Update The session["user"] After The Changes To The Database
			User.update_session()

			return response(
				type="success",
				message="eMailVerificationSuccess",
				setSessionUser=True,
				domChange=["menu"],
				redirect="/home"
			)
