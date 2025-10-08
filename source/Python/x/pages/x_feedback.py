from main import session

from Python.x.modules.Page import Page
from Python.x.modules.MySQL import MySQL
from Python.x.modules.response import response

@Page.build({
	"enabled": False,
	"methods": ["GET", "POST"],
	"endpoints": ["/x/feedback"]
})
def x_feedback(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_feedback":
				data = MySQL.execute("""
					SELECT
						feedback.*,
						CONCAT(users.firstname, ' ', users.lastname) AS users_fullname,
						users.eMail AS users_eMail
					FROM feedback
					LEFT JOIN users ON users.id = feedback.created_by_user
					WHERE feedback.flag_deleted IS NULL;
				""")
				if data == False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, default_serializer_func=str)

			if request.get_json()["for"] == "delete":
				if "id" not in request.get_json(): return response(type="error",message="invalid_request")

				data = MySQL.execute(
					sql="""
						UPDATE feedback
						SET
							feedback.flag_deleted = NOW(),
							feedback.flag_deleted_by_user = %s
						WHERE
							feedback.id = %s AND
							feedback.flag_deleted IS NULL
						LIMIT 1;
					""",
					params=[
						session["user"]["id"],
						request.get_json()["id"]
					],
					commit=True
				)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="deleted", DOM_change=["main"])
