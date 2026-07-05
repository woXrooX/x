import json
from main import app, request, make_response, session
from Python.x.modules.Globals import Globals
from Python.x.modules.User import User
from Python.x.modules.Response import Response

@app.route("/API", methods=["POST"])
def API():
	##### Manually guarding since this route is not part of the automated pages.
	### "application/json"
	if request.content_type == "application/json":
		# Invalid JSON
		if request.get_json() is None: return Response.make(type="warning", message="invalid_request")

		# Check if "for" in request
		if "for" not in request.get_json(): return Response.make(type="warning", message="invalid_request")

		if request.get_json()["for"] == "get:CONFIGURATIONS": return Response.make(
			type="success",
			message="success",
			data=Globals.PUBLIC_CONF,
			default_serializer_func=str
		)

		if request.get_json()["for"] == "get:session": return Response.make(
			type="success",
			message="success",
			data={"user": User.generate_public_session()} if "user" in session else {},
			default_serializer_func=str
		)

		if request.get_json()["for"] == "get:LANGUAGE_DICTIONARY": return Response.make(
			type="success",
			message="success",
			data=Globals.LANGUAGE_DICTIONARY
		)

		if request.get_json()["for"] == "get:USER_AUTHENTICITY_STATUSES": return Response.make(
			type="success",
			message="success",
			data=Globals.USER_AUTHENTICITY_STATUSES
		)

		if request.get_json()["for"] == "get:USER_ROLES": return Response.make(
			type="success",
			message="success",
			data=Globals.USER_ROLES
		)

		if request.get_json()["for"] == "get:USER_OCCUPATIONS": return Response.make(
			type="success",
			message="success",
			data=Globals.USER_OCCUPATIONS
		)

		if request.get_json()["for"] == "get:NOTIFICATION_TYPES": return Response.make(
			type="success",
			message="success",
			data=Globals.NOTIFICATION_TYPES
		)

		if request.get_json()["for"] == "get:PROJECT_SVG": return Response.make(
			type="success",
			message="success",
			data=Globals.PROJECT_SVG
		)

		if request.get_json()["for"] == "get:CURRENCIES": return Response.make(
			type="success",
			message="success",
			data=Globals.CURRENCIES
		)


		if request.get_json()["for"] == "change_user_app_color_mode":
			if "color_mode" not in request.get_json(): return Response.make(type="error", message="invalid_value")

			if not User.set_app_color_mode(request.get_json()["color_mode"]): return Response.make(type="error", message="something_went_wrong")

			return Response.make(type="success", message="saved")

		if request.get_json()["for"] == "change_user_app_language":
			if "code" not in request.get_json() or not request.get_json()["code"]: return Response.make(type="error", message="invalid_request")

			if not User.set_app_language(request.get_json()["code"]): return Response.make(type="error", message="something_went_wrong")

			return Response.make(type="success", message="saved")

		if request.get_json()["for"] == "set_last_heartbeat_at":
			if not User.set_last_heartbeat_at(): return Response.make(type="error", message="something_went_wrong")

			return Response.make(type="success", message="saved")

	# If no matches, return "invalid_request"
	return ("Bad Request", 400, {'Content-Type': 'text/plain; charset=utf-8'})
