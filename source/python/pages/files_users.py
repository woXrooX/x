# URL: /files/users/user_id/public_or_private/path_and_file

from main import app, session, send_from_directory, abort
from python.modules.Globals import Globals

@app.route("/files/users/<int:ID>/<PRIVATE_PUBLIC>/<path:PATH_AND_FILE>", methods=["GET"])
def files_users(ID, PRIVATE_PUBLIC, PATH_AND_FILE):
	if PRIVATE_PUBLIC == "private":
		if "user" in session and session["user"]["id"] == ID:

			try: return send_from_directory(f"{Globals.X_RUNNING_FROM}/project_files/users/{ID}/private/", path=PATH_AND_FILE, as_attachment=False)
			except: return abort(404)

		else: return abort(403)

	elif PRIVATE_PUBLIC == "public":

			try: return send_from_directory(f"{Globals.X_RUNNING_FROM}/project_files/users/{ID}/public/", path=PATH_AND_FILE, as_attachment=False)
			except: return abort(404)

	else: return abort(400)
