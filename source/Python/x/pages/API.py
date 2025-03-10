import json
from main import app, request, make_response, session
from Python.x.modules.Globals import Globals
from Python.x.modules.User import User
from Python.x.modules.response import response

@app.route("/API", methods=["POST"])
def API():
	##### Manually guarding since this route is not part of the automated pages.
	### "application/json"
	if request.content_type == "application/json":
		# Invalid JSON
		if request.get_json() is None: return response(type="warning", message="invalid_request")

		# Check if "for" in request
		if "for" not in request.get_json(): return response(type="warning", message="invalid_request")

		if request.get_json()["for"] == "initial_data":
			return make_response(
				{
					"CONF": Globals.PUBLIC_CONF,
					"session": {"user": User.generate_public_session()} if "user" in session else {},
					"LANG_DICT": Globals.LANG_DICT,
					"USER_AUTHENTICITY_STATUSES": Globals.USER_AUTHENTICITY_STATUSES,
					"USER_ROLES": Globals.USER_ROLES,
					"USER_OCCUPATIONS": Globals.USER_OCCUPATIONS,
					"NOTIFICATION_TYPES": Globals.NOTIFICATION_TYPES,
					"PROJECT_SVG": Globals.PROJECT_SVG
				}, 200)

		if request.get_json()["for"] == "change_user_app_color_mode":
			if "color_mode" not in request.get_json(): return response(type="error", message="invalid_value")

			if not User.set_app_color_mode(request.get_json()["color_mode"]): return response(type="error", message="something_went_wrong")

			return response(type="success", message="saved")

		if request.get_json()["for"] == "change_user_app_language":
			if "code" not in request.get_json() or not request.get_json()["code"]: return response(type="error", message="invalid_request")

			if not User.set_app_language(request.get_json()["code"]): return response(type="error", message="something_went_wrong")

			return response(type="success", message="saved")

	# If no matches, return "invalid_request"
	return ("Bad Request", 400, {'Content-Type': 'text/plain; charset=utf-8'})
