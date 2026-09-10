import re, random

from main import session

from Python.x.modules.Page import Page
from Python.x.modules.Notifications import Notifications
from Python.x.modules.Response import Response
from Python.x.modules.Log_In_Tools import Log_In_Tools
from Python.x.modules.User import User
from Python.x.modules.PostgreSQL import PostgreSQL
from Python.x.modules.Logger import Log

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"authenticity_statuses": ["unauthenticated"],
# 	"endpoints": ["/sign_up"]
# })
@Page.build()
def sign_up(request):
	if request.method == "POST":
		if request.form["for"] == "sign_up":
			if "eMail" not in request.form or not request.form["eMail"]: return Response.make(type="error", message="eMail_empty", field="eMail")
			password = request.form["password"] if "password" in request.form and request.form["password"] else None

			user_create_res = User.create(
				metadata_created_by_user = "self",
				password = password,
				eMail = request.form["eMail"],
				authenticity_status = "unauthorized"
			)

			if type(user_create_res) is Response: return user_create_res



			session["user"] = user_create_res["user"]
			session.permanent = True

			if not User.update_session(): Log.warning("sign_up.py->User.update_session()")



			try:
				from Python.project.modules.on_sign_up import on_sign_up
				on_sign_up()

			except Exception as err: Log.warning(f"sign_up.py->on_sign_up(): {err}")



			Log_In_Tools.new_record(request, "success")



			return Response.make(
				type = "success",
				message = "success",
				set_session_user = True,
				redirect = "/",
				DOM_change = ["all"]
			)
