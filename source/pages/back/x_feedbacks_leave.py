import re

from main import session

from Python.x.modules.Page import Page
from Python.x.modules.PostgreSQL import PostgreSQL
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
				full_name = None
				eMail = None

				if "user" not in session:
					if "full_name" not in request.form or not request.form["full_name"]: return Response.make(type="error", message="invalid_value", field="full_name")
					full_name = request.form["full_name"]

					if "eMail" not in request.form or not request.form["eMail"]: return Response.make(type="error", message="invalid_value", field="eMail")
					if not re.match(Globals.CONF["eMail"]["regEx"], request.form["eMail"]): return Response.make(type="error", message="eMailInvalid", field="eMail")
					eMail = request.form["eMail"]

				if "user" in session:
					created_by_user = session["user"]["id"]
					eMail = session["user"]["eMail"]

				if "feedback_text" not in request.form or not request.form["feedback_text"]: return Response.make(type="error", message="invalid_value", field="feedback_text")

				res = PostgreSQL.execute(
					SQL="""
						INSERT INTO "feedbacks" ("IP_address", "user_agent", "feedback_left_page", "created_by_user", "full_name", "eMail", "feedback_text")
						VALUES (%s, %s, %s, %s, %s, %s, %s);
					""",
					params=[
						extract_IP_address_from_request(request),
						request.headers.get('User-Agent', None),
						request.form["feedback_left_page"],
						created_by_user,
						full_name,
						eMail,
						request.form["feedback_text"]
					]
				)
				if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="saved")
