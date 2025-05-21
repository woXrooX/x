import re

from main import session

from Python.x.modules.Page import Page
from Python.x.modules.MySQL import MySQL
from Python.x.modules.response import response
from Python.x.modules.Globals import Globals

@Page.build()
def x_feedback_leave(request):
	if request.method == "POST":
		if "multipart/form-data" in request.content_type.split(';'):
			if request.form["for"] == "leave_feedback":
				if "feedback_left_page" not in request.form or not request.form["feedback_left_page"]: return response(type="error", message="invalid_request")

				created_by_user = None
				fullname = None
				eMail = None

				if "user" not in session:
					if "fullname" not in request.form or not request.form["fullname"]: return response(type="error", message="invalid_value", field="fullname")
					fullname = request.form["fullname"]

					if "eMail" not in request.form or not request.form["eMail"]: return response(type="error", message="invalid_value", field="eMail")
					if not re.match(Globals.CONF["eMail"]["regEx"], request.form["eMail"]): return response(type="error", message="eMailInvalid", field="eMail")
					eMail =request.form["eMail"]


				if "user" in session:
					created_by_user = session["user"]["id"]

				if "feedback_text" not in request.form or not request.form["feedback_text"]: return response(type="error", message="invalid_value", field="feedback_text")

				data = MySQL.execute(
					sql="""
						INSERT INTO feedback
							(ip_address, user_agent, feedback_left_page, created_by_user, fullname, eMail, feedback_text)
						VALUES (%s, %s, %s, %s, %s, %s, %s);
					""",
					params=[
						request.remote_addr,
						request.headers.get('User-Agent'),
						request.form["feedback_left_page"],
						created_by_user,
						fullname,
						eMail,
						request.form["feedback_text"]
					],
					commit=True
				)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="saved")
