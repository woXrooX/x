import os

from python.modules.Page import Page
from python.modules.response import response
from python.modules.Globals import Globals
from python.modules.MySQL import MySQL
from python.modules.User import User
from python.modules.SendGrid import SendGrid

@Page.build()
def x_root(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "sanitize_users_folders":
				users = MySQL.execute("SELECT id FROM users;")
				if users is False: return response(type="error", message="database_error")

				user_IDs = [user["id"] for user in users]

				# Delete non-existing user folders
				for folder in os.scandir(f'{Globals.X_RUNNING_FROM}/project_files/users/'):
					# Check if folder
					if folder.is_dir() is False: continue

					# Try to convert folder name to int
					try: folder_name_int = int(folder.name)
					except: continue

					# If folder is in user_IDs skip
					if folder_name_int in user_IDs: continue

					if User.delete_files(folder_name_int) is False: return response(type="warning", message=f"Could not delete folder: {folder_name_int}")

				# Create user folders
				for userID in user_IDs:
					if User.init_folders(userID) is False: return response(type="warning", message=f"Could not create user folder: {userID}")

				return response(type="success", message="success")

			if request.get_json()["for"] == "get_all_users":
				users = MySQL.execute(
					sql="""
						SELECT
							users.id,
							users.firstname,
							users.lastname,
							users.eMail,
							GROUP_CONCAT(DISTINCT user_roles.name ORDER BY user_roles.name ASC SEPARATOR ', ') AS roles_list,
							users.last_update,
							users.timestamp
						FROM users
						LEFT JOIN users_roles ON users.id = users_roles.user
						LEFT JOIN user_roles ON user_roles.id = users_roles.role
						GROUP BY users.id;
					"""
				)
				if users is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=users, default_serializer_func=str)

			if request.get_json()["for"] == "get_all_log_in_records":
				if Globals.CONF["tools"].get("log_in_tools", {}).get("enable_recording", False) is False: return response(type="info", message="log_in_tools_recording_disabled")

				data = MySQL.execute("SELECT * FROM log_in_records;")
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, default_serializer_func=str)

		if "multipart/form-data" in request.content_type.split(';'):
			if request.form["for"] == "eMail_send":
				# I/ data validations
				from_email = request.form["local_part"] if "local_part" in request.form and request.form["local_part"] else "noreply"
				if "to_email" not in request.form or not request.form["to_email"]: return response(type="error", message="invalid_value", field="to_email")
				subject = request.form["subject"] if "subject" in request.form and request.form["subject"] else None
				if "content" not in request.form or not request.form["content"]: return response(type="error", message="invalid_value", field="content")

				if SendGrid.send(from_email, request.form["to_email"], request.form["content"], subject) is False: return response(type="error", message="Could not send email")
				return response(type="success", message="Email has been sent")
