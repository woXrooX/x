from Python.x.modules.Page import Page
from Python.x.modules.Response import Response
from Python.x.modules.Globals import Globals
from Python.x.modules.PostgreSQL import PostgreSQL

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"roles": ["root"],
# 	"endpoints": ["/x/log_in_records"]
# })
@Page.build()
def x_log_in_records(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_log_in_records":
				if Globals.CONF["tools"].get("log_in_tools", {}).get("enable_recording", False) is False: return Response.make(type="info", message="log_in_tools_recording_disabled")

				res = PostgreSQL.execute("""SELECT * FROM "log_in_records" ORDER BY "id" DESC;""")
				if "error" in res: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="success", data=res["data"], default_serializer_func=str)
