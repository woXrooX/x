from main import session

from python.modules.Page import Page
from python.modules.response import response
from python.modules.MySQL import MySQL

@Page.build()
def x_notification(request, ID):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_notification":
				data = MySQL.execute(
					sql="""
						SELECT
							notifications.*,
							notification_events.name as event,
							notification_types.name as type
						FROM notifications
						LEFT JOIN notification_events ON notification_events.id = notifications.event
						LEFT JOIN notification_types ON notification_types.id = notifications.type
						WHERE recipient=%s AND notifications.id = %s LIMIT 1;
					""",
					params=[session['user']['id'], ID],
					fetchOne=True
				)
				if data is False: return response(type="error", message="database_error")
				
				if data is not None:
					seen = MySQL.execute("UPDATE notifications SET seen=1 WHERE id=%s", [data['id']], commit=True)
					if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, defaultSerializerFunc=str)
