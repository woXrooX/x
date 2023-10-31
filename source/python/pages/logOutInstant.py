from main import app, request, render_template, session
from python.modules.pageGuard import pageGuard
from python.modules.response import response
from python.modules.Globals import Globals


#################################################### Log Out
@app.route("/logOutInstant", methods=["POST"])
@pageGuard("logOutInstant")
def logOutInstant():
	if request.method != "POST": return response(type="error", message="invalidRequest")

	if request.get_json()["for"] != "logOutInstant": return response(type="error", message="invalidRequest")

	session.pop('user')

	return response(type="success");
