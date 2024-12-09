from main import session
from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.Globals import Globals

# Allow only POST methods
@Page.build()
def log_out_instant(request):
	if request.method != "POST": return response(type="error", message="invalid_request")

	if request.get_json()["for"] != "log_out_instant": return response(type="error", message="invalid_request")

	session.pop('user')

	return response(type="success");
