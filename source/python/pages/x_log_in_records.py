from python.modules.Page import Page
from python.modules.response import response
from python.modules.Globals import Globals
from python.modules.MySQL import MySQL

@Page.build()
def x_log_in_records(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_log_in_records":
				if Globals.CONF["tools"].get("log_in_tools", {}).get("enable_recording", False) is False: return response(type="info", message="log_in_tools_recording_disabled")

				data = MySQL.execute("SELECT * FROM log_in_records ORDER BY id DESC;")
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, default_serializer_func=str)
