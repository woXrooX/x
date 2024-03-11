from main import session
from python.modules.Page import Page
from python.modules.response import response
from python.modules.Globals import Globals

@Page.build()
def logOut(request):
	if request.method == "POST":
		# unknownError
		if request.form["for"] != "logOut": return response(type="warning", message="unknownError")

		# Remove User From Session
		session.pop('user')

		try:
			from python.modules.onLogOut import onLogOut
			onLogOut()

		except ModuleNotFoundError: pass

		# Redirect To Home
		return response(
			type="success",
			message="success",
			deleteSessionUser=True,
			redirect="/home",
			domChange=["menu"]
		)
