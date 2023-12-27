# URL: /user_files/user_id/public_or_private/path_and_file

from main import app, session, send_from_directory
from python.modules.Globals import Globals

@app.route("/user_files/<ID>/<PRIVATE_PUBLIC>/<path:PATH_AND_FILE>", methods=["GET"])
def user_files(ID, PRIVATE_PUBLIC, PATH_AND_FILE):
	if PRIVATE_PUBLIC == "private":
		if "user" in session and session["user"]["id"] == ID:
			try: return send_from_directory(f"{Globals.X_RUNNING_FROM}/users/{ID}/private/", path=PATH_AND_FILE, as_attachment=False)
			except: return "404 Not Found", 404

		else: return "403 Forbidden", 403

	elif PRIVATE_PUBLIC == "public":
			try: return send_from_directory(f"{Globals.X_RUNNING_FROM}/users/{ID}/public/", path=PATH_AND_FILE, as_attachment=False)
			except: return "404 Not Found", 404

	else: return "400 Bad Request", 400
