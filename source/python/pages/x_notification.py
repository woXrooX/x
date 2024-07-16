from python.modules.Page import Page
from python.modules.response import response
from python.modules.Notifications import Notifications

@Page.build()
def x_notification(request, ID):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_notification":
				data = Notifications.get_one(ID)
				if data is False: return response(type="error", message="database_error")

				if data is not None: Notifications.set_seen(ID)

				return response(type="success", message="success", data=data, defaultSerializerFunc=str)
