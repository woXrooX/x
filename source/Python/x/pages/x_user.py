import random

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.MySQL import MySQL
from Python.x.modules.User import User
from Python.x.modules.SendGrid import SendGrid
from Python.x.modules.Globals import Globals

@Page.build()
def x_user(request, id):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_user":
				data = MySQL.execute(
					"""
						SELECT
							users.*,
							GROUP_CONCAT(DISTINCT user_roles.name ORDER BY user_roles.name ASC SEPARATOR ', ') AS roles_list
						FROM users
						LEFT JOIN users_roles ON users.id = users_roles.user
						LEFT JOIN user_roles ON user_roles.id = users_roles.role
						WHERE users.id=%s
						GROUP BY users.id LIMIT 1;
					""",
					[id],
					fetch_one=True
				)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, default_serializer_func=str)

			if request.get_json()["for"] == "get_user_log_in_records":
				data = MySQL.execute("SELECT ip_address, user_agent, timestamp FROM log_in_records WHERE user = %s;", [id])
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, default_serializer_func=str)


			if request.get_json()["for"] == "delete_user":
				if User.soft_delete(id) is not True: return response(type="warning", message="could_not_delete", dom_change=["main"])

				return response(type="success", message="deleted", redirect="/x/users")

			if request.get_json()["for"] == "resend_eMail_confirmation":
				user = MySQL.execute("SELECT eMail, eMail_verified FROM users WHERE id=%s LIMIT 1;", [id], fetch_one=True)
				if user is False or user is None: return response(type="error", message="database_error")
				if user["eMail"] is None or user["eMail_verified"] == 1: return response(type="info", message="Email is already verified")

				eMail_verification_code = random.randint(100000, 999999)

				data = MySQL.execute("UPDATE users SET eMail_verification_code=%s WHERE id=%s LIMIT 1", [eMail_verification_code, id], commit=True)
				if data is False: return response(type="error", message="database_error")

				eMail_content = f"""
					Dear User,

					<h2>Welcome to {Globals.PROJECT_LANG_DICT.get(Globals.CONF["default"]["title"], {}).get(Globals.CONF["default"]["language"]["fallback"], "x")}!</h2>

					<p>Please verify your email address using the code below:</p>

					<h2>{eMail_verification_code}</h2>

					<p>If you did not create an account using this email address, please ignore this message.</p>

					<p>{Globals.PROJECT_LANG_DICT.get(Globals.CONF["default"]["title"], {}).get(Globals.CONF["default"]["language"]["fallback"], "x")} Team</p>
				"""

				if SendGrid.send("noreply", user["eMail"], eMail_content, "Email verification") is False: return response(type="error", message="could_not_send_eMail_verification_code")
				return response(type="success", message="Email verification code has been sent")
