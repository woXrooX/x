import secrets

from python.modules.Page import Page
from python.modules.SendGrid import SendGrid
from python.modules.response import response
from python.modules.MySQL import MySQL
from python.modules.Globals import Globals

@Page.build()
def requestPasswordRecovery(request):
	if request.method == "POST":
		# unknownError
		if request.form["for"] != "requestPasswordRecovery": return response(type="warning", message="unknownError")

		# eMailEmpty
		if "eMail" not in request.form or not request.form["eMail"]: return response(type="error", message="eMailEmpty", field="eMail")

		# Check If eMail Exist
		user = MySQL.execute(
			sql="SELECT id, password FROM users WHERE eMail=%s LIMIT 1;",
			params=(request.form["eMail"],),
			fetchOne=True
		)
		if user is False: return response(type="error", message="databaseError")
		if not user: return response(type="error", message="eMailNotFound")


		#### Check if the link already has been sent
		data = MySQL.execute(
			sql="SELECT 1 FROM password_recoveries WHERE password_recoveries.user = %s AND TIMESTAMPDIFF(MINUTE, password_recoveries.timestamp_first, NOW()) < %s LIMIT 1;",
			params = (user['id'], Globals.CONF["password"]["recoveryLinkValidityDuration"]),
			fetchOne=True
		)
		if data is False: return response(type="error", message="databaseError")
		if data: return response(type="info", message="linkAlreadyHasBeenSent", redirect="/home")

		#### Sned the recovery link
		token = secrets.token_urlsafe(32)

		# Save the token to database
		data = MySQL.execute(
			sql="INSERT INTO password_recoveries (user, token, ip_address_first, user_agent_first, password_old) VALUES (%s, %s, %s, %s, %s);",
			params=(user['id'], token, request.remote_addr, request.headers.get('User-Agent'), user["password"]),
			commit=True
		)
		if data is False: return response(type="error", message="databaseError")

		# SendGrid
		if SendGrid.send("noreply", request.form["eMail"], f'{request.url_root}resetPassword/{token}', "Password recovery") is not True:
			# Handle error
			pass

		return response(type="success", message="An email with password reset instructions has been sent to you.", redirect="/home")
