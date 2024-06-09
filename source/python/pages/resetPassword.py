import re

from python.modules.Page import Page
from python.modules.response import response
from python.modules.LogInTools import LogInTools
from python.modules.MySQL import MySQL
from python.modules.Globals import Globals

@Page.build()
def resetPassword(request, TOKEN):
	if request.method == "POST":
		# unknown_error
		if request.form["for"] != "resetPassword": return response(type="warning", message="unknown_error")

		######## Password validation
		# password_empty
		if "password" not in request.form or not request.form["password"]: return response(type="error", message="password_empty", field="password")

		# password_min_length
		if len(request.form["password"]) < Globals.CONF["password"]["min_length"]: return response(type="error", message="password_min_length", field="password")

		# password_max_length
		if len(request.form["password"]) > Globals.CONF["password"]["max_length"]: return response(type="error", message="password_max_length", field="password")

		# password_allowed_chars
		if not re.match(Globals.CONF["password"]["regEx"], request.form["password"]): return response(type="error", message="password_allowed_chars", field="password")

		# confirm_password_empty
		if "confirm_password" not in request.form or not request.form["confirm_password"]: return response(type="error", message="invalid_value", field="confirm_password")

		# Passwords do not match
		if request.form["password"] != request.form["confirm_password"]: return response(type="error", message="passwords_do_not_match", field="confirm_password")

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
		if prd is False: return response(type="error", message="database_error")

		# No matching token
		if not prd: return response(type="error", message="invalid_token", redirect="/400")

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
		if data is False: return response(type="error", message="database_error")

		return response(type="success", message="password_changed_successfully", redirect="/logIn")
