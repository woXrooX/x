import re

from python.modules.Page import Page
from python.modules.response import response
from python.modules.LogInTools import LogInTools
from python.modules.MySQL import MySQL
from python.modules.Globals import Globals

@Page.build()
def resetPassword(request, TOKEN):
	if request.method == "POST":
		# unknownError
		if request.form["for"] != "resetPassword": return response(type="warning", message="unknownError")

		######## Password validation
		# passwordEmpty
		if "password" not in request.form or not request.form["password"]: return response(type="error", message="passwordEmpty", field="password")

		# passwordMinLength
		if len(request.form["password"]) < Globals.CONF["password"]["min_length"]: return response(type="error", message="passwordMinLength", field="password")

		# passwordMaxLength
		if len(request.form["password"]) > Globals.CONF["password"]["max_length"]: return response(type="error", message="passwordMaxLength", field="password")

		# passwordAllowedChars
		if not re.match(Globals.CONF["password"]["regEx"], request.form["password"]): return response(type="error", message="passwordAllowedChars", field="password")

		# confirm_password_empty
		if "confirm_password" not in request.form or not request.form["confirm_password"]: return response(type="error", message="invalidValue", field="confirm_password")

		# Passwords do not match
		if request.form["password"] != request.form["confirm_password"]: return response(type="error", message="passwordsDoNotMatch", field="confirm_password")

		password = LogInTools.passwordHash(request.form["password"])

		######## Token validation
		# prd = password recovery data
		prd = MySQL.execute(
			sql="""
				SELECT
					user, timestamp_first, password_new FROM password_recoveries
				WHERE token=%s AND TIMESTAMPDIFF(MINUTE, password_recoveries.timestamp_first, NOW()) < %s LIMIT 1;
			""",
			params=(TOKEN, Globals.CONF["password"]["recovery_link_validity_duration"]),
			fetchOne=True
		)
		if prd is False: return response(type="error", message="databaseError")

		# No matching token
		if not prd: return response(type="error", message="invalidToken", redirect="/400")

		# Already recovered
		if prd["password_new"] is not None: return response(type="info", message="token_aready_used", redirect="/logIn")

		# Set the new users passowrd and update password_recoveries
		data = MySQL.execute(
			sql="""
				UPDATE users SET password=%s WHERE id=%s;

				UPDATE password_recoveries SET ip_address_last = %s, user_agent_last = %s, timestamp_last = NOW(), password_new = %s WHERE token = %s;
			""",
			params=(password, prd['user'], request.remote_addr, request.headers.get('User-Agent'), password, TOKEN),
			multi=True,
			commit=True
		)
		if data is False: return response(type="error", message="databaseError")

		return response(type="success", message="password_changed_successfully", redirect="/logIn")
