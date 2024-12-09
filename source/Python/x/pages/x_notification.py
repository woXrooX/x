from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.Notifications import Notifications

@Page.build()
def x_notification(request, ID):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_notification":
				data = Notifications.get_one(ID)
				if data is False: return response(type="error", message="database_error")

				if data is not None: Notifications.set_seen(ID)

				return response(type="success", message="success", data=data, default_serializer_func=str)

			if request.get_json()["for"] == "delete_notification":
				data = Notifications.delete(ID)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="deleted", redirect="/x/notifications")
