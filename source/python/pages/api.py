import json
from main import app, request, make_response, session
from python.modules.Globals import Globals
from python.modules.User import User
from python.modules.response import response

@app.route("/api", methods=["POST"])
def api():
	##### Manually guarding since this route is not part of the automated pages.
	### "application/json"
	if request.content_type == "application/json":
		# Invalid JSON
		if request.get_json() is None: return response(type="warning", message="invalidRequest")

		# Check if "for" in request
		if "for" not in request.get_json(): return response(type="warning", message="invalidRequest")


		if request.get_json()["for"] == "initialData":
			return make_response(
				{
					"CONF": Globals.PUBLIC_CONF,
					"session": {"user": User.generatePublicSession()} if "user" in session else {},
					"LANG_DICT": Globals.LANG_DICT,
					"USER_AUTHENTICITY_STATUSES": Globals.USER_AUTHENTICITY_STATUSES,
					"USER_ROLES": Globals.USER_ROLES,
					"PROJECT_SVG": Globals.PROJECT_SVG
				}, 200)

		if request.get_json()["for"] == "changeUserAppColorMode":
			if "colorMode" not in request.get_json(): return response(type="error", message="invalidValue")

			if not User.setAppColorMode(request.get_json()["colorMode"]): return response(type="error", message="somethingWentWrong")

			return response(type="success", message="saved")

		if request.get_json()["for"] == "changeUserAppLanguage":
			if "code" not in request.get_json() or not request.get_json()["code"]: return response(type="error", message="invalidRequest")

			if not User.setAppLanguage(request.get_json()["code"]): return response(type="error", message="somethingWentWrong")

			return response(type="success", message="saved")
