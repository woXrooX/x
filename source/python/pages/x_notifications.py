from main import session

from python.modules.Page import Page
from python.modules.response import response
from python.modules.MySQL import MySQL
from python.modules.Notifications import Notifications 

@Page.build()
def x_notifications(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_notifications":
				data = Notifications.get_all(session['user']['id'])
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, defaultSerializerFunc=str)
