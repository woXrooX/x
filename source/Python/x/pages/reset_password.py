import re

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.Log_In_Tools import Log_In_Tools
from Python.x.modules.MySQL import MySQL
from Python.x.modules.Globals import Globals

@Page.build()
def reset_password(request, TOKEN):
	if request.method == "POST":
		# unknown_error
		if request.form["for"] != "reset_password": return response(type="warning", message="unknown_error")

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

		password = Log_In_Tools.password_hash(request.form["password"])

		######## Token validation
		# PRD = password recovery data
		PRD = MySQL.execute(
			sql="""
				SELECT
					user,
					timestamp_first,
					password_new
				FROM password_recoveries
				WHERE
					token=%s AND
					TIMESTAMPDIFF(MINUTE, password_recoveries.timestamp_first, NOW()) < %s
				LIMIT 1;
			""",
			params=[
				TOKEN,
				Globals.CONF["password"]["recovery_link_validity_duration"]
			],
			fetch_one=True
		)
		if PRD is False: return response(type="error", message="database_error")

		# No matching token
		if not PRD: return response(type="error", message="invalid_token", redirect="/400")

		# Already recovered
		if PRD["password_new"] is not None: return response(type="info", message="token_aready_used", redirect="/log_in")

		# Set the new users passowrd and update password_recoveries
		data = MySQL.execute(
			sql="""
				UPDATE users SET password = %s WHERE id = %s;
				UPDATE password_recoveries SET ip_address_last = %s, user_agent_last = %s, timestamp_last = NOW(), password_new = %s WHERE token = %s;
			""",
			params=[
				password,
				PRD['user'],
				request.remote_addr,
				request.headers.get('User-Agent'),
				password,
				TOKEN
			],
			commit=True
		)
		if data is False: return response(type="error", message="database_error")

		return response(type="success", message="password_changed_successfully", redirect="/log_in")
