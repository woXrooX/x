from main import session

from python.modules.Page import Page
from python.modules.response import response
from python.modules.Notifications import Notifications
import time

@Page.build()
def x_notifications(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_notifications":
				data = Notifications.get_all(session['user']['id'])
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, default_serializer_func=str)

			if request.get_json()["for"] == "get_unseen_count":
				data = Notifications.get_unseen_count(session['user']['id'])
				if data is False: return response(type="error", message="database_error")
				if "unseen_notifications_count" in data: return response(type="success", message="success", data=data["unseen_notifications_count"])
				return response(type="success", message="success")

			if request.get_json()["for"] == "delete_all_notifications":
				data = Notifications.delete_all(request.get_json()["IDs"])
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", dom_change=["main"])

