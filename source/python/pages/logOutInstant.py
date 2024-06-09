from main import session
from python.modules.Page import Page
from python.modules.response import response
from python.modules.Globals import Globals

# Allow only POST methods
@Page.build()
def logOutInstant(request):
	if request.method != "POST": return response(type="error", message="invalid_request")

	if request.get_json()["for"] != "logOutInstant": return response(type="error", message="invalid_request")

	session.pop('user')

	return response(type="success");
