import secrets

from Python.x.modules.Page import Page
from Python.x.modules.SendGrid import SendGrid
from Python.x.modules.response import response
from Python.x.modules.MySQL import MySQL
from Python.x.modules.Globals import Globals
from Python.x.modules.IP_address_tools import extract_IP_address_from_request

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"authenticity_statuses": ["unauthenticated"],
# 	"endpoints": ["/password_reset_request"]
# })
@Page.build()
def password_reset_request(request):
	if request.method == "POST":
		if request.form["for"] != "password_reset_request": return response(type="warning", message="unknown_error")

		# eMail_empty
		if "eMail" not in request.form or not request.form["eMail"]: return response(type="error", message="eMail_empty", field="eMail")

		# Check If eMail Exist
		user = MySQL.execute(
			sql="SELECT id, password FROM users WHERE eMail=%s LIMIT 1;",
			params=[request.form["eMail"]],
			fetch_one=True
		)
		if user is False: return response(type="error", message="database_error")
		if not user: return response(type="error", message="user_with_this_eMail_does_not_exists")

		#### Check if the link already has been sent
		data = MySQL.execute(
			sql="""
				SELECT 1
				FROM password_reset_requests
				WHERE password_reset_requests.user = %s AND TIMESTAMPDIFF(MINUTE, password_reset_requests.timestamp_first, NOW()) < %s LIMIT 1;
			""",
			params = [
				user['id'],
				Globals.CONF["password"]["recovery_link_validity_duration"]
			],
			fetch_one=True
		)
		if data is False: return response(type="error", message="database_error")
		if data: return response(type="info", message="password_recovery_link_already_has_been_sent", redirect="/")

		#### The recovery link
		token = secrets.token_urlsafe(32)

		# Save the token to database
		data = MySQL.execute(
			sql="INSERT INTO password_reset_requests (user, token, ip_address_first, user_agent_first, old_password) VALUES (%s, %s, %s, %s, %s);",
			params=[
				user['id'],
				token,
				extract_IP_address_from_request(request),
				request.headers.get('User-Agent', None),
				user["password"]
			],
			commit=True
		)
		if data is False: return response(type="error", message="database_error")

		eMail_content = f"""
			<h3>Dear user</h3>
			<p>We have received your request to reset your password. Please click the link below to set a new password for your account.</p>
			<p>Reset password link: {request.url_root}password_reset/{token}</p>
			<p>If you did not request a password reset, please ignore this email. Your account will remain secure.</p>
			<p>Warm regards,</p>
			<p>The {Globals.PROJECT_LANGUAGE_DICTIONARY.get(Globals.CONF["project_name"], {}).get(Globals.CONF["default"]["language"]["fallback"], "x")} Team</p>
		"""

		if SendGrid.send("noreply", request.form["eMail"], eMail_content, "Reset password") is not True:
			return response(type="warning", message="Unable to send email. Your request has been saved. Please reach out to support for further assistance", redirect="/")

		return response(type="success", message="password_recovery_link_has_been_sent", redirect="/")
