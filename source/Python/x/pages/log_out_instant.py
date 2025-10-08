from main import session

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.Logger import Log

# @Page.build({
# 	"enabled": False,
# 	"authenticity_statuses": ["unauthorized", "authorized"],
# 	"methods": ["POST"],
# 	"endpoints": ["/log_out_instant"]
# })
@Page.build()
def log_out_instant(request):
	if request.method != "POST": return response(type="error", message="invalid_request")

	if request.get_json()["for"] != "log_out_instant": return response(type="error", message="invalid_request")

	session.pop('user')

	try:
		from Python.project.modules.on_log_out import on_log_out
		on_log_out()

	except Exception as err: Log.warning(f"log_out_instant.py->on_log_out(): {err}")

	return response(type="success", message="success")
