from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.MySQL import MySQL
from Python.x.modules.User import User

@Page.build()
def x_users(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_users":
				users = MySQL.execute(
					sql="""
						SELECT
							users.id,
							users.firstname,
							users.lastname,
							users.eMail,
							GROUP_CONCAT(DISTINCT user_roles.name ORDER BY user_roles.name ASC SEPARATOR ', ') AS roles_list,
							users.last_heartbeat_at,
							users.last_update,
							users.timestamp
						FROM users
						LEFT JOIN users_roles ON users.id = users_roles.user
						LEFT JOIN user_roles ON user_roles.id = users_roles.role
						GROUP BY users.id;
					"""
				)
				if users is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=users, default_serializer_func=str)

			if request.get_json()["for"] == "get_live_users_count":
				live_users = MySQL.execute("SELECT COUNT(id) AS live_users FROM users WHERE (last_heartbeat_at >= NOW() - INTERVAL 30 SECOND);", fetch_one=True)
				if live_users is False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=live_users)
