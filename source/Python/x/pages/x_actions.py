import os

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.Globals import Globals
from Python.x.modules.MySQL import MySQL
from Python.x.modules.User import User
from Python.x.modules.SendGrid import SendGrid

@Page.build({
	"enabled": False,
	"roles": ["root"],
	"methods": ["GET", "POST"],
	"endpoints": ["/x/actions"]
})
def x_actions(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "sanitize_users_folders":
				users = MySQL.execute("SELECT id FROM users;")
				if users is False: return response(type="error", message="database_error")

				user_IDs = [user["id"] for user in users]

				# Delete non-existing user folders
				for folder in os.scandir(f'{Globals.PROJECT_PATH}/Files/users/'):
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

		if "multipart/form-data" in request.content_type.split(';'):
			if request.form["for"] == "eMail_send":
				# I/ data validations
				from_email = request.form["local_part"] if "local_part" in request.form and request.form["local_part"] else "noreply"
				if "to_email" not in request.form or not request.form["to_email"]: return response(type="error", message="invalid_value", field="to_email")
				subject = request.form["subject"] if "subject" in request.form and request.form["subject"] else None
				if "content" not in request.form or not request.form["content"]: return response(type="error", message="invalid_value", field="content")

				if SendGrid.send(from_email, request.form["to_email"], request.form["content"], subject) is False: return response(type="error", message="Could not send email")
				return response(type="success", message="Email has been sent")
