import os

from python.modules.Page import Page
from python.modules.response import response
from python.modules.Globals import Globals
from python.modules.MySQL import MySQL
from python.modules.User import User

@Page.build()
def x_root(request):
	if request.method == "POST":
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
						users.*,
						GROUP_CONCAT(DISTINCT user_roles.name ORDER BY user_roles.name ASC SEPARATOR ', ') AS roles_list

					FROM users

					LEFT JOIN users_roles ON users.id = users_roles.user

					LEFT JOIN user_roles ON user_roles.id = users_roles.role

					GROUP BY users.id;
				"""
			)

			if users is False: return response(type="error", message="database_error")

			return response(type="success", message="success", data=users, defaultSerializerFunc=str)
