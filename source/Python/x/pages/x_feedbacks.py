from main import session

from Python.x.modules.Page import Page
from Python.x.modules.MySQL import MySQL
from Python.x.modules.Response import Response

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"endpoints": ["/x/feedbacks"]
# })
@Page.build()
def x_feedbacks(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_feedbacks":
				data = MySQL.execute("""
					SELECT
						feedbacks.*,
						CONCAT(users.first_name, ' ', users.last_name) AS users_fullname,
						users.eMail AS users_eMail
					FROM feedbacks
					LEFT JOIN users ON users.id = feedbacks.created_by_user
					WHERE feedbacks.flag_deleted IS NULL;
				""")
				if data == False: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="success", data=data, default_serializer_func=str)

			if request.get_json()["for"] == "delete":
				if "id" not in request.get_json(): return Response.make(type="error",message="invalid_request")

				data = MySQL.execute(
					sql="""
						UPDATE feedbacks
						SET
							feedbacks.flag_deleted = NOW(),
							feedbacks.flag_deleted_by_user = %s
						WHERE
							feedbacks.id = %s AND
							feedbacks.flag_deleted IS NULL
						LIMIT 1;
					""",
					params=[
						session["user"]["id"],
						request.get_json()["id"]
					],
					commit=True
				)
				if data is False: return Response.make(type="error", message="database_error")

				return Response.make(type="success", message="deleted", DOM_change=["main"])
