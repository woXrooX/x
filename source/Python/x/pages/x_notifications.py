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
				Notifications.new(
					recipient=session['user']['id'],
					event_name="DPP_welcome_after_sign_up",
					type_name="success",
					via_in_app=True,
					via_eMail=True
				)

				data = MySQL.execute(
					sql="""
						SELECT
							notifications.*,
							notification_events.name as event,
							notification_types.name as type
						FROM notifications
						LEFT JOIN notification_events ON notification_events.id = notifications.event
						LEFT JOIN notification_types ON notification_types.id = notifications.type
						WHERE notifications.flag_deleted IS NULL AND notifications.recipient = %s
						ORDER BY timestamp DESC;
					""",
					params=[session['user']['id']]
				)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, default_serializer_func=str)

			if request.get_json()["for"] == "get_unseen_count":
				data = MySQL.execute(
					sql="""
						SELECT COUNT(*) AS unseen_notifications_count
						FROM notifications
						WHERE notifications.flag_deleted IS NULL AND recipient = %s AND seen = 0;
					""",
					params=[session['user']['id']],
					fetch_one=True
				)
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

