import os

from Python.x.modules.Page import Page
from Python.x.modules.Response import Response
from Python.x.modules.Globals import Globals
from Python.x.modules.MySQL import MySQL
from Python.x.modules.User import User
from Python.x.modules.SendGrid import SendGrid

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"roles": ["root"],
# 	"endpoints": ["/x/actions"]
# })
@Page.build()
def x_actions(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "sanitize_users_folders":
				users = MySQL.execute("SELECT id FROM users;")
				if users is False: return Response.make(type="error", message="database_error")

				user_ids = [user["id"] for user in users]

				# Delete non-existing user folders
				for folder in os.scandir(f'{Globals.PROJECT_PATH}/Files/users/'):
					# Check if folder
					if folder.is_dir() is False: continue

					# Try to convert folder name to int
					try: folder_name_int = int(folder.name)
					except: continue

					# If folder is in user_ids skip
					if folder_name_int in user_ids: continue

					if User.delete_files(folder_name_int) is False: return Response.make(type="warning", message=f"Could not delete folder: {folder_name_int}")

				# Create user folders
				for user_id in user_ids:
					if User.init_folders(user_id) is False: return Response.make(type="warning", message=f"Could not create user folder: {user_id}")

				return Response.make(type="success", message="success")

			if request.get_json()["for"] == "project_Cron_Jobs_init":
				try:
					from Python.project.modules.Cron_Jobs import Cron_Jobs
					Cron_Jobs.init()
					return Response.make(type="success", message="success")

				except Exception as err: return Response.make(type="error", message=err)

		if "multipart/form-data" in request.content_type.split(';'):
			if request.form["for"] == "eMail_send":
				# I/ data validations
				from_email = request.form["local_part"] if "local_part" in request.form and request.form["local_part"] else "noreply"
				if "to_email" not in request.form or not request.form["to_email"]: return Response.make(type="error", message="invalid_value", field="to_email")
				subject = request.form["subject"] if "subject" in request.form and request.form["subject"] else None
				if "content" not in request.form or not request.form["content"]: return Response.make(type="error", message="invalid_value", field="content")

				if SendGrid.send(from_email, request.form["to_email"], request.form["content"], subject) is False: return Response.make(type="error", message="Could not send email")
				return Response.make(type="success", message="Email has been sent")
