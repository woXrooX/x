import random

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.MySQL import MySQL
from Python.x.modules.User import User
from Python.x.modules.Notifications import Notifications
from Python.x.modules.Globals import Globals

@Page.build()
def x_user(request, id):
	if request.method == "POST":
		if "multipart/form-data" in request.content_type.split(';'):
			if request.form["for"] == "update_roles":
				roles = request.form.getlist("roles") if "roles" in request.form and request.form["roles"] else []

				# Prep the params
				params = []
				for role in roles:
					if role in Globals.USER_ROLES:
						params.append((id, Globals.USER_ROLES[role]["id"]))

				# Delete all old user roles
				data = MySQL.execute(
					sql="DELETE FROM users_roles WHERE user = %s;",
					params=[id],
					commit=True
				)
				if data is False: return response(type="error", message="database_error")

				if len(params) > 0:
					data = MySQL.execute(
						sql="INSERT INTO users_roles (user, role) VALUES (%s, %s);",
						params=params,
						commit=True,
						many=True
					)
					if data is False: return response(type="error", message="database_error")

				return response(type="success", message="saved", DOM_change=["main"])

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

			if request.get_json()["for"] == "get_user_roles": return response(type="success", message="success", data=Globals.USER_ROLES)

			if request.get_json()["for"] == "get_user_log_in_records":
				data = MySQL.execute("SELECT ip_address, user_agent, timestamp FROM log_in_records WHERE user = %s;", [id])
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, default_serializer_func=str)

			if request.get_json()["for"] == "delete_user":
				if User.soft_delete(id) is not True: return response(type="warning", message="could_not_delete", DOM_change=["main"])

				return response(type="success", message="deleted", redirect="/x/users")

			if request.get_json()["for"] == "resend_eMail_confirmation":
				user = MySQL.execute("SELECT eMail, eMail_verified FROM users WHERE id=%s LIMIT 1;", [id], fetch_one=True)
				if user is False or user is None: return response(type="error", message="database_error")
				if user["eMail"] is None: return response(type="warning", message="This user has no eMail address")
				if user["eMail_verified"] == 1: return response(type="info", message="Email is already verified")

				eMail_verification_code = random.randint(100000, 999999)

				data = MySQL.execute(
					sql="""
						UPDATE users
						SET
							eMail_verification_code = %s,
							eMail_verification_attempts_count = 0,
							authenticity_status = 2
						WHERE
							id = %s AND
							flag_deleted IS NULL
						LIMIT 1;
					""",
					params=[eMail_verification_code, id],
					commit=True
				)
				if data is False: return response(type="error", message="database_error")

				if Notifications.new_eMail(
					recipient=user,
					content_JSON={"eMail_verification_code": eMail_verification_code},
					event_name="sign_up_eMail_verification"
				) is not True: return response(type="error", message="could_not_send_eMail_verification_code")

				return response(type="success", message="eMail_confirmation_code_has_been_sent")
