# TODO: Session user and general user helpers needs to be separated. Session_User class and User class respectively

if __name__ != "__main__":
	import re
	import os
	import shutil
	import random

	from main import session

	from Python.x.modules.PostgreSQL import PostgreSQL
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log
	from Python.x.modules.Response import Response
	from Python.x.modules.Log_In_Tools import Log_In_Tools

	class User:
		########################### General

		########### APIs

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

		@staticmethod
		def soft_delete(user_id):
			if not user_id: return False

			data = PostgreSQL.execute(
				SQL="""
					UPDATE "users"
					SET
						"flag_deleted_at" = NOW(),
						"flag_deleted_by_user" = %s,
						"flag_deleted_username" = "username",
						"flag_deleted_eMail" = "eMail",
						"flag_deleted_phone_number" = "phone_number",
						"username" = NULL,
						"eMail" = NULL,
						"phone_number" = NULL
					WHERE
						"id" = %s AND
						"flag_deleted_at" IS NULL;
				""",
				params=[
					session["user"]["id"],
					user_id
				]
			)
			if "error" in data: return False

			return True

		@staticmethod
		def create(
			metadata_created_by_user = None,

			username = None,
			password = None,

			eMail = None,
			eMail_verified = '0',
			eMail_verification_code = None,
			eMail_verification_attempts_count = 0,

			phone_number = None,
			phone_number_verified = '0',
			phone_number_verification_code = None,
			phone_number_verification_attempt = 0,

			first_name = None,
			last_name = None,
			birth_date = None,

			gender = None,

			profile_picture = None,
			cover_picture = None,
			background_picture = None,

			authenticity_status = None,

			currency = None,
			app_language = None,
			app_color_mode = 1
		):
			if (
				username is None and
				eMail is None and
				phone_number is None
			): return Response.make(type="error", message="invalid_request")



			if password is None: return Response.make(type="error", message="password_empty", field="password")
			else:
				if len(password) < Globals.CONF["password"]["min_length"]: return Response.make(type="error", message="password_min_length", field="password")

				if len(password) > Globals.CONF["password"]["max_length"]: return Response.make(type="error", message="password_max_length", field="password")

				if not re.match(Globals.CONF["password"]["regEx"], password): return Response.make(type="error", message="password_allowed_chars", field="password")

				password = Log_In_Tools.password_hash(password)



			if eMail is not None:
				if not re.match(Globals.CONF["eMail"]["regEx"], eMail): return Response.make(type="error", message="eMail_invalid", field="eMail")

				eMail_verification_code = random.randint(100000, 999999)



			if authenticity_status is not None:
				if authenticity_status not in Globals.USER_AUTHENTICITY_STATUSES: return Response.make(type="error", message="invalid_request")

				authenticity_status = Globals.USER_AUTHENTICITY_STATUSES[authenticity_status]["id"]



			connection = PostgreSQL.get_connection_from_pool()
			if connection is False: return Response.make(type="error", message="database_error")



			user_res = PostgreSQL.execute(
				SQL="""
					INSERT INTO "users"

					(
						"metadata_created_by_user",

						"username",
						"password",

						"eMail",
						"eMail_verified",
						"eMail_verification_code",
						"eMail_verification_attempts_count",

						"phone_number",
						"phone_number_verified",
						"phone_number_verification_code",
						"phone_number_verification_attempt",

						"first_name",
						"last_name",
						"birth_date",

						"gender",

						"profile_picture",
						"cover_picture",
						"background_picture",

						"authenticity_status",

						"currency",
						"app_language",
						"app_color_mode"
					)

					VALUES (
						%s,

						%s,
						%s,

						%s,
						%s::BIT(1),
						%s,
						%s,

						%s,
						%s::BIT(1),
						%s,
						%s,

						%s,
						%s,
						%s,

						%s::BIT(1),

						%s,
						%s,
						%s,

						%s,

						%s,
						%s,
						%s
					)

					RETURNING *;
				""",
				params=[
					None if metadata_created_by_user == "self" else metadata_created_by_user,

					username,
					password,

					eMail,
					eMail_verified,
					eMail_verification_code,
					eMail_verification_attempts_count,

					phone_number,
					phone_number_verified,
					phone_number_verification_code,
					phone_number_verification_attempt,

					first_name,
					last_name,
					birth_date,

					gender,

					profile_picture,
					cover_picture,
					background_picture,

					authenticity_status,

					currency,
					app_language,
					app_color_mode
				],
				commit=False,
				borrowed_connection=connection,
				fetch_type="one"
			)

			if "error" in user_res:
				if user_res["SQL_state"] == "23505":
					if user_res["constraint_name"] == "users_eMail_key": return Response.make(type="error", message="eMail_in_use", field="eMail")
					if user_res["constraint_name"] == "users_phone_number_key": return Response.make(type="error", message="phone_number_in_use", field="phone_number")

				return Response.make(type="error", message="database_error")


			if user_res["data"] is None:
				PostgreSQL.put_connection_to_pool(connection)
				return Response.make(type="error", message="database_error")


			user_res = user_res["data"]



			if metadata_created_by_user == "self":
				update_res = PostgreSQL.execute(
					SQL="""
						UPDATE "users"
						SET "metadata_created_by_user" = %s
						WHERE "id" = %s;
					""",
					params=[
						user_res["id"],
						user_res["id"]
					],
					commit=False,
					borrowed_connection=connection,
					include_PostgreSQL_data=True
				)

				if "error" in update_res: return Response.make(type="error", message="database_error")


			if not User.init_folders(user_res["id"]): Log.warning("Users.create(): User.init_folders()")



			PostgreSQL.commit_connection(connection)
			PostgreSQL.put_connection_to_pool(connection)



			return user_res


		########### Helpers



		########################### Session

		########### APIs

		@staticmethod
		def get_roles():
			if "user" not in session: return False

			data = PostgreSQL.execute(
				SQL="""
					SELECT "user_roles"."name"
					FROM "user_roles"
					INNER JOIN "users_roles" ON
						"user_roles"."id" = "users_roles"."role" AND
						"users_roles"."user" = %s;
				""",
				params=[session["user"]["id"]]
			)
			if "error" in data: return False

			session["user"]["roles"] = []

			# Extracting IDs From Response
			for role in data["data"]: session["user"]["roles"].append(role["name"])

			Log.success("User.get_roles()")

			return True

		@staticmethod
		def get_occupations():
			if "user" not in session: return False

			data = PostgreSQL.execute(
				SQL="""
					SELECT "user_occupations"."name"
					FROM "user_occupations"
					INNER JOIN "users_occupations" ON
						"user_occupations".id = "users_occupations"."occupation" AND
						"users_occupations"."user" = %s;
				""",
				params=[session["user"]["id"]]
			)
			if "error" in data: return False

			session["user"]["occupations"] = []

			# Extracting IDs From Response
			for occupation in data["data"]: session["user"]["occupations"].append(occupation["name"])

			Log.success("User.get_occupations()")

			return True

		@staticmethod
		def set_last_heartbeat_at():
			if "user" not in session: return False

			data = PostgreSQL.execute(
				SQL="""
					UPDATE "users"
					SET "last_heartbeat_at" = NOW()
					WHERE "id" = %s;
				""",
				params=[session["user"]["id"]]
			)
			if "error" in data: return False

			Log.success("User.set_last_heartbeat_at()")

			return True

		@staticmethod
		def set_app_color_mode(color_mode):
			if "user" not in session: return False

			# Replace the [1, 2] with the data retrived from the database "app_color_modes"
			if color_mode not in [1, 2]: return False

			data = PostgreSQL.execute(
				SQL="""UPDATE "users" SET "app_color_mode"=%s WHERE "id"=%s""",
				params=[color_mode, session["user"]["id"]]
			)
			if "error" in data: return False

			# Not working if I try to update single key
			# session["user"]["app_color_mode"] = color_mode
			if User.update_session() is False: pass

			Log.success("User.set_app_color_mode()")

			return True

		@staticmethod
		def set_app_language(code):
			if "user" not in session: return False

			if code not in Globals.CONF["default"]["language"]["supported"]: return False

			if code not in Globals.LANGUAGES: return False

			data = PostgreSQL.execute(
				SQL="""UPDATE "users" SET "app_language"=%s WHERE "id"=%s""",
				params=[Globals.LANGUAGES[code]["id"], session["user"]["id"]]
			)
			if "error" in data: return False

			if User.update_session() is False: pass

			Log.success("User.set_app_language()")

			return True


		@staticmethod
		def generate_public_session():
			if "user" not in session: return False

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
				"occupations": session["user"]["occupations"]
			}

		@staticmethod
		def update_session():
			if "user" not in session: return False

			data = PostgreSQL.execute(
				SQL="""
					SELECT
						"users".*,
						"user_authenticity_statuses"."name" AS "authenticity_status",
						"languages"."code" AS "app_language"
					FROM "users"
					LEFT JOIN "user_authenticity_statuses" ON "users"."authenticity_status" = "user_authenticity_statuses"."id"
					LEFT JOIN "languages" ON "languages"."id" = "users"."app_language"
					WHERE "users"."id"=%s LIMIT 1;
				""",
				params=[session["user"]["id"]],
				fetch_type="one"
			)
			if "error" in data: return False

			session["user"] = data["data"]

			if not User.get_roles(): pass

			if not User.get_occupations(): pass

			Log.success("User.update_session()")

			return True

		@staticmethod
		def update_username(new_username):
			if "user" not in session: return False

			if not new_username: return Response.make(type="error", message="invalid_username", field="username")
			if session["user"]["username"] == new_username: return Response.make(type="error", message="old_and_new_usernames_same", field="username")
			if not re.match(Globals.CONF["username"]["regEx"], new_username): return Response.make(type="error", message="invalid_username", field="username")

			update_username = PostgreSQL.execute(
				SQL="""
					UPDATE "users"
					SET "users"."username" = %s
					WHERE
						"users"."id" = %s AND
						"users"."flag_deleted_at" IS NULL;
				""",
				params=[new_username, session["user"]["id"]],
				commit=False,
				include_PostgreSQL_data=True
			)
			if "error" in update_username and update_username["SQL_state"] == "23505": return Response.make(type="error", message="username_exists")
			if "error" in update_username: return Response.make(type="error", message="database_error")

			if update_username["row_count"] != 1:
				PostgreSQL.put_connection_to_pool(update_username["connection"])
				return Response.make(type="error", message="database_error")

			update_record = PostgreSQL.execute(
				SQL="""INSERT INTO "users_username_records" ("user", "username") VALUES (%s, %s);""",
				params=[session["user"]["id"], new_username],
				borrowed_connection=update_username["connection"]
			)
			if "error" in update_record: return Response.make(type="error", message="database_error")

			return True



		########### Helpers


