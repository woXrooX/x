import re

from main import session

from Python.x.modules.Page import Page
from Python.x.modules.MySQL import MySQL
from Python.x.modules.Response import Response
from Python.x.modules.Globals import Globals
from Python.x.modules.IP_address_tools import extract_IP_address_from_request

# @Page.build({
# 	"enabled": False,
# 	"methods": ["POST"],
# 	"endpoints": ["/x/feedbacks/leave"]
# })
@Page.build()
def x_feedbacks_leave(request):
	if request.method == "POST":
		if "multipart/form-data" in request.content_type.split(';'):
			if request.form["for"] == "leave_feedback":
				if "feedback_left_page" not in request.form or not request.form["feedback_left_page"]: return Response.make(type="error", message="invalid_request")

				created_by_user = None
				fullname = None
				eMail = None

				if "user" not in session:
					if "fullname" not in request.form or not request.form["fullname"]: return Response.make(type="error", message="invalid_value", field="fullname")
					fullname = request.form["fullname"]

					if "eMail" not in request.form or not request.form["eMail"]: return Response.make(type="error", message="invalid_value", field="eMail")
					if not re.match(Globals.CONF["eMail"]["regEx"], request.form["eMail"]): return Response.make(type="error", message="eMailInvalid", field="eMail")
					eMail = request.form["eMail"]

				if "user" in session:
					created_by_user = session["user"]["id"]
					eMail = session["user"]["eMail"]

				if "feedback_text" not in request.form or not request.form["feedback_text"]: return Response.make(type="error", message="invalid_value", field="feedback_text")

				data = MySQL.execute(
					sql="""
						INSERT INTO feedbacks
							(ip_address, user_agent, feedback_left_page, created_by_user, fullname, eMail, feedback_text)
						VALUES (%s, %s, %s, %s, %s, %s, %s);
					""",
					params=[
						extract_IP_address_from_request(request),
						request.headers.get('User-Agent', None),
						request.form["feedback_left_page"],
						created_by_user,
						fullname,
						eMail,
						request.form["feedback_text"]
					],
					commit=True
				)
				if data is False: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="saved")
