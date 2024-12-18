from main import session

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.Notifications import Notifications
from Python.x.modules.MySQL import MySQL
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
				data = MySQL.execute(
					sql="UPDATE notifications SET flag_deleted = NOW(), flag_deleted_by_user = %s WHERE recipient=%s;",
					params=[session["user"]["id"], session["user"]["id"]],
					commit=True
				)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="deleted", DOM_change=["main"])

