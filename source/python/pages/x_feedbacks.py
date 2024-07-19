from main import session

from python.modules.Page import Page
from python.modules.MySQL import MySQL
from python.modules.response import response

@Page.build()
def x_feedbacks(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_feedbacks":
				data = MySQL.execute("""
					SELECT
						feedbacks.*,
						CONCAT(users.firstname, ' ', users.lastname) AS users_fullname,
						users.eMail AS users_eMail
					FROM feedbacks
					LEFT JOIN users ON users.id = feedbacks.created_by_user;
				""")
				if data == False: return response(type="error", message="database_error")

				return response(type="success", message="success", data=data, default_serializer_func=str)

			if request.get_json()["for"] == "delete":
				if "id" not in request.get_json(): return response(type="error",message="invalid_request")

				data = MySQL.execute(
					sql="DELETE FROM feedbacks WHERE id=%s;",
					params=[request.get_json()["id"]],
					commit=True
				)
				if data is False: return response(type="error", message="database_error")

				return response(type="success", message="deleted", dom_change=["main"])
