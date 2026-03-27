import re

from Python.x.modules.Page import Page
from Python.x.modules.Response import Response
from Python.x.modules.MySQL import MySQL
from Python.x.modules.User import User
from Python.x.modules.Globals import Globals
from Python.x.modules.Log_In_Tools import Log_In_Tools

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"roles": ["root"],
# 	"endpoints": ["/x/users"]
# })
@Page.build()
def x_users(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_users":
				users = MySQL.execute(
					sql="""
						SELECT
							users.id,
							users.first_name,
							users.last_name,
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
				if users is False: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="success", data=users, default_serializer_func=str)

			if request.get_json()["for"] == "get_live_users_count":
				live_users = MySQL.execute("SELECT COUNT(id) AS live_users FROM users WHERE (last_heartbeat_at >= NOW() - INTERVAL 30 SECOND);", fetch_one=True)
				if live_users is False: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="success", data=live_users)

		if "multipart/form-data" in request.content_type.split(';'):
			if request.form["for"] == "create_user":
				first_name = request.form["first_name"] if "first_name" in request.form and request.form["first_name"] else None
				last_name = request.form["last_name"] if "last_name" in request.form and request.form["last_name"] else None


				######## eMail

				if "eMail" not in request.form or not request.form["eMail"]: return Response.make(type="error", message="eMail_empty", field="eMail")

				if not re.match(Globals.CONF["eMail"]["regEx"], request.form["eMail"]): return Response.make(type="error", message="eMail_invalid", field="eMail")

				data = MySQL.execute(
					sql="SELECT id FROM users WHERE eMail=%s LIMIT 1;",
					params=[request.form["eMail"]],
					fetch_one=True
				)
				if data: return Response.make(type="error", message="eMail_in_use", field="eMail")


				######## password

				if "password" not in request.form or not request.form["password"]: return Response.make(type="error", message="password_empty", field="password")

				if len(request.form["password"]) < Globals.CONF["password"]["min_length"]: return Response.make(type="error", message="password_min_length", field="password")

				if len(request.form["password"]) > Globals.CONF["password"]["max_length"]: return Response.make(type="error", message="password_max_length", field="password")

				if not re.match(Globals.CONF["password"]["regEx"], request.form["password"]): return Response.make(type="error", message="password_allowed_chars", field="password")

				password = Log_In_Tools.password_hash(request.form["password"])

				data = MySQL.execute(
					sql="INSERT INTO users (first_name, last_name, eMail, password) VALUES (%s, %s, %s, %s)",
					params=[
						first_name,
						last_name,
						request.form["eMail"],
						password
					],
					commit=True
				)
				if data is False: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="success", DOM_change=["main"])
