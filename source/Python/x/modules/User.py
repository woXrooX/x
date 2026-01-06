if __name__ != "__main__":
	import re
	import os
	import shutil

	from main import session

	from Python.x.modules.MySQL import MySQL
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log
	from Python.x.modules.Response import Response

	class User:
		# NOTE: Designed for use as a decorator
		# If user is not in session, returns False
		@staticmethod
		def check_if_user_in_session(func):
			def wrapper(*args, **kwargs):
				if "user" not in session: return False
				return func(*args, **kwargs)
			return wrapper



		########################### Getters

		@staticmethod
		@check_if_user_in_session
		def get_roles():
			data = MySQL.execute(
					sql="""
						SELECT user_roles.name
						FROM user_roles
						INNER JOIN users_roles
						ON user_roles.id = users_roles.role AND users_roles.user = %s
					""",
					params=(session["user"]["id"],)
				)

			if data is False: return False

			session["user"]["roles"] = []

			# Extracting IDs From Response
			for role in data: session["user"]["roles"].append(role["name"])

			Log.success("User.get_roles()")

			return True

		@staticmethod
		@check_if_user_in_session
		def get_occupations():
			data = MySQL.execute(
					sql="""
						SELECT user_occupations.name
						FROM user_occupations
						INNER JOIN users_occupations
						ON user_occupations.id = users_occupations.occupation AND users_occupations.user = %s
					""",
					params=(session["user"]["id"],)
				)

			if data is False: return False

			session["user"]["occupations"] = []

			# Extracting IDs From Response
			for occupation in data: session["user"]["occupations"].append(occupation["name"])

			Log.success("User.get_occupations()")

			return True

		@staticmethod
		@check_if_user_in_session
		def get_plan():
			data = MySQL.execute(
				"SELECT user_plans.name FROM user_plans WHERE id = %s LIMIT 1;",
				(session["user"]["plan"],),
				fetch_one=True
			)

			if data is False: return False

			if data is None: session["user"]["plan"] = None
			else: session["user"]["plan"] = data["name"]

			Log.success("User.get_plan()")

			return True



		########################### Setters

		@staticmethod
		@check_if_user_in_session
		def set_last_heartbeat_at():
			data = MySQL.execute("UPDATE users SET last_heartbeat_at = NOW() WHERE id = %s LIMIT 1;", [session["user"]["id"]], commit=True)
			if data is False: return False

			Log.success("User.set_last_heartbeat_at()")

			return True

		@staticmethod
		@check_if_user_in_session
		def set_app_color_mode(color_mode):
			# Replace the [1, 2] with the data retrived from the database "app_color_modes"
			if color_mode not in [1, 2]: return False

			data = MySQL.execute(
				sql="UPDATE users SET app_color_mode=%s WHERE id=%s",
				params=(color_mode, session["user"]["id"]),
				commit=True
			)

			if data is False: return False

			# Not working if I try to update single key
			# session["user"]["app_color_mode"] = color_mode
			if User.update_session() is False: pass

			Log.success("User.set_app_color_mode()")

			return True

		@staticmethod
		@check_if_user_in_session
		def set_app_language(code):
			if code not in Globals.CONF["default"]["language"]["supported"]: return False

			if code not in Globals.LANGUAGES: return False

			data = MySQL.execute(
				sql="UPDATE users SET app_language=%s WHERE id=%s",
				params=(Globals.LANGUAGES[code]["id"], session["user"]["id"]),
				commit=True
			)

			if data is False: return False

			if User.update_session() is False: pass

			Log.success("User.set_app_language()")

			return True



		########################### Updates

		@staticmethod
		@check_if_user_in_session
		def update_username(new_username):
			if not new_username: return Response.make(type="error", message="invalid_username", field="username")
			if session["user"]["username"] == new_username: return Response.make(type="error", message="old_and_new_usernames_same", field="username")
			if not re.match(Globals.CONF["username"]["regEx"], new_username): return Response.make(type="error", message="invalid_username", field="username")

			update_data = MySQL.execute(
				sql="""
					UPDATE users
					SET users.username = %s
					WHERE
						users.id = %s AND
						users.flag_deleted IS NULL
					LIMIT 1;
				""",
				params=[new_username, session["user"]["id"]],
				commit=True,
				include_MySQL_data=True
			)
			if update_data is False: return Response.make(type="error", message="database_error")
			if "error" in update_data and int(update_data["error_no"]) == 1062: return Response.make(type="error", message="username_exists")
			if "error" in update_data: return Response.make(type="error", message="database_error")

			record_data = MySQL.execute(
				sql="INSERT INTO users_username_records (user, username) VALUES (%s, %s);",
				params=[session["user"]["id"], new_username],
				commit=True
			)
			if record_data is False: return Response.make(type="error", message="database_error")

			return True



		########################### Files & folders

		@staticmethod
		def init_folders(id = None):
			ID = None

			if id is not None:
				if isinstance(id, int) and id > 0: ID = id
				else:
					Log.warning(f"Invalid argument passed to the method @ user.init_folders(): {id}. Due to invalid ID, could not initiate user folders.")

					return False

			elif "user" in session: ID = session["user"]["id"]

			else: return False

			path = f'{Globals.PROJECT_PATH}/Files/users/{ID}/'

			# Try to create user folders
			try:
				# ID
				os.makedirs(f'{path}', mode=0o777, exist_ok=True)
				os.makedirs(f'{path}private', mode=0o777, exist_ok=True)
				os.makedirs(f'{path}public', mode=0o777, exist_ok=True)

				# Files (For all kinds of files. For example: .zip or .exe ...)
				# Documents (All kinds of files used as a document. For example it can be .png file but the image contex is some kind certificate)
				folders = ["images", "videos", "audios", "files", "documents"]

				for folder in folders:
					os.makedirs(f'{path}private/{folder}', mode=0o777, exist_ok=True)
					os.makedirs(f'{path}public/{folder}', mode=0o777, exist_ok=True)


				Log.success(f"User folders created @: {path}")

				return True

			except:
				Log.error(f"Could not create user folder(s) @: {path}")

				return False

		@staticmethod
		def delete_files(id):
			try:
				shutil.rmtree(f'{Globals.PROJECT_PATH}/Files/users/{id}/')

				Log.success(f"User files deleted. User ID: {id}")

				return True

			except:
				Log.error(f"Could not delete user files. User ID: {id}")

				return False



		########################### Session

		# Sanitized Session Data For Front
		@staticmethod
		@check_if_user_in_session
		def generate_public_session():

			Log.success("User.generate_public_session()")

			return {
				"id": session["user"]["id"],
				"username": session["user"]["username"],
				"first_name": session["user"]["first_name"],
				"last_name": session["user"]["last_name"],
				"profile_picture": session["user"]["profile_picture"],
				"app_color_mode": session["user"]["app_color_mode"],
				"app_language": session["user"]["app_language"],
				"authenticity_status": session["user"]["authenticity_status"],
				"roles": session["user"]["roles"],
				"occupations": session["user"]["occupations"],
				"plan": session["user"]["plan"],
			}

		@staticmethod
		@check_if_user_in_session
		def update_session():
			data = MySQL.execute(
				sql="""
					SELECT
						users.*,
						user_authenticity_statuses.name AS authenticity_status,
						languages.code AS 'app_language'
					FROM users
					LEFT JOIN user_authenticity_statuses ON users.authenticity_status = user_authenticity_statuses.id
					LEFT JOIN languages ON languages.id = users.app_language
					WHERE users.id=%s LIMIT 1;
				""",
				params=(session["user"]["id"],),
				fetch_one=True
			)

			# Error
			if data is False: return False

			session["user"] = data

			if not User.get_roles(): pass

			if not User.get_occupations(): pass

			if not User.get_plan(): pass

			Log.success("User.update_session()")

			return True



		########################### Other

		@staticmethod
		def soft_delete(user_id):
			if not user_id: return False

			data = MySQL.execute(
				sql="""
					UPDATE users
					SET
						flag_deleted = NOW(),
						flag_deleted_by_user = %s,
						flag_deleted_username = username,
						flag_deleted_eMail = eMail,
						flag_deleted_phone_number = phone_number,
						username = NULL,
						eMail = NULL,
						phone_number = NULL
					WHERE
						id = %s AND
						flag_deleted IS NULL
					LIMIT 1;
				""",
				params=[
					session["user"]["id"],
					user_id
				],
				commit=True
			)
			if data is False: return False

			return True
