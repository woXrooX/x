from main import session
from python.modules.Page import Page
from python.modules.response import response
from python.modules.Globals import Globals

@Page.build()
def log_out(request):
	if request.method == "POST":
		# unknown_error
		if request.form["for"] != "log_out": return response(type="warning", message="unknown_error")

		# Remove User From Session
		session.pop('user')

		try:
			from python.modules.on_log_out import on_log_out
			on_log_out()

		except ModuleNotFoundError: pass

		# Redirect To Home
		return response(
			type="success",
			message="success",
			delete_session_user=True,
			redirect="/",
			dom_change=["menu"]
		)
