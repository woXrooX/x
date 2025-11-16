import re

from Python.x.modules.Page import Page
from Python.x.modules.Response import Response
from Python.x.modules.Log_In_Tools import Log_In_Tools
from Python.x.modules.MySQL import MySQL
from Python.x.modules.Globals import Globals
from Python.x.modules.IP_address_tools import extract_IP_address_from_request

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"authenticity_statuses": ["unauthenticated"],
# 	"endpoints": ["/password_reset/<TOKEN>"]
# })
@Page.build()
def password_reset(request, TOKEN):
	if request.method == "POST":
		if request.form["for"] != "password_reset": return Response.make(type="warning", message="unknown_error")

		######## Password validation
		if "new_password" not in request.form or not request.form["new_password"]: return Response.make(type="error", message="password_empty", field="new_password")
		if len(request.form["new_password"]) < Globals.CONF["password"]["min_length"]: return Response.make(type="error", message="password_min_length", field="new_password")
		if len(request.form["new_password"]) > Globals.CONF["password"]["max_length"]: return Response.make(type="error", message="password_max_length", field="new_password")
		if not re.match(Globals.CONF["password"]["regEx"], request.form["new_password"]): return Response.make(type="error", message="password_allowed_chars", field="new_password")
		if "confirm_new_password" not in request.form or not request.form["confirm_new_password"]: return Response.make(type="error", message="invalid_value", field="confirm_new_password")
		if request.form["new_password"] != request.form["confirm_new_password"]: return Response.make(type="error", message="passwords_do_not_match", field="confirm_new_password")

		password = Log_In_Tools.password_hash(request.form["new_password"])

		######## Token validation
		# PRD = password recovery data
		PRD = MySQL.execute(
			sql="""
				SELECT
					user,
					timestamp_first,
					new_password
				FROM password_reset_requests
				WHERE
					token=%s AND
					TIMESTAMPDIFF(MINUTE, password_reset_requests.timestamp_first, NOW()) < %s
				LIMIT 1;
			""",
			params=[
				TOKEN,
				Globals.CONF["password"]["recovery_link_validity_duration"]
			],
			fetch_one=True
		)
		if PRD is False: return Response.make(type="error", message="database_error")

		# No matching token
		if not PRD: return Response.make(type="error", message="invalid_token", redirect="/400")

		# Already recovered
		if PRD["new_password"] is not None: return Response.make(type="info", message="token_aready_used", redirect="/log_in")

		# Set the new users passowrd and update password_reset_requests
		data = MySQL.execute(
			sql="""
				UPDATE users SET password = %s WHERE id = %s;
				UPDATE password_reset_requests SET ip_address_last = %s, user_agent_last = %s, timestamp_last = NOW(), new_password = %s WHERE token = %s;
			""",
			params=[
				password,
				PRD['user'],
				extract_IP_address_from_request(request),
				request.headers.get('User-Agent', None),
				password,
				TOKEN
			],
			commit=True
		)
		if data is False: return Response.make(type="error", message="database_error")

		return Response.make(type="success", message="password_changed_successfully", redirect="/log_in")
