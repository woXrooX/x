from main import session

from Python.x.modules.Page import Page
from Python.x.modules.MySQL import MySQL
from Python.x.modules.response import response

@Page.build()
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
					LEFT JOIN users ON users.id = feedback.created_by_user;
				""")
				if data == False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, default_serializer_func=str)

			if request.get_json()["for"] == "delete":
				if "id" not in request.get_json(): return response(type="error",message="invalid_request")

				data = MySQL.execute(
					sql="DELETE FROM feedback WHERE id=%s;",
					params=[request.get_json()["id"]],
					commit=True
				)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="deleted", dom_change=["main"])
