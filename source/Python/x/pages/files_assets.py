# URL: /files/assets/public_or_private/path_and_file

from main import app, session, send_from_directory, abort
from Python.x.modules.Globals import Globals


@app.route("/files/assets/<PRIVATE_PUBLIC>/<path:PATH_AND_FILE>", methods=["GET"])
def files_assets(PRIVATE_PUBLIC, PATH_AND_FILE):
	if PRIVATE_PUBLIC == "private": return abort(404)

	elif PRIVATE_PUBLIC == "public":

			try: return send_from_directory(f"{Globals.PROJECT_PATH}/Files/assets/public/", path=PATH_AND_FILE, as_attachment=False)
			except: return abort(404)

	else: return abort(400)
