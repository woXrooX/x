from main import session

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.Globals import Globals
from Python.x.modules.Logger import Log

# @Page.build({
# 	"enabled": False,
# 	"authenticity_statuses": ["unauthorized", "authorized"],
# 	"methods": ["GET", "POST"],
# 	"endpoints": ["/log_out"]
# })
@Page.build()
def log_out(request):
	if request.method == "POST":
		# unknown_error
		if request.form["for"] != "log_out": return response(type="warning", message="unknown_error")

		# Remove User From Session
		session.pop('user')

		try:
			from Python.project.modules.on_log_out import on_log_out
			on_log_out()

		except Exception as err: Log.warning(f"log_out.py->on_log_out(): {err}")

		# Redirect To Home
		return response(
			type="success",
			message="success",
			delete_session_user=True,
			redirect="/",
			DOM_change=["menu"]
		)
