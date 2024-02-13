import secrets, datetime

from python.modules.Page import Page
from python.modules.SendGrid import SendGrid
from python.modules.response import response
from python.modules.MySQL import MySQL

@Page.build()
def forgotPwd(request):
	if request.method == "POST":
		# unknownError
		if request.form["for"] != "forgotPwd":
			return response(type="warning", message="unknownError")
		
		# eMailEmpty
		if "eMail" not in request.form or not request.form["eMail"]: return response(type="error", message="eMailEmpty", field="eMail")
		
		######## Check If eMail Exist
		id = MySQL.execute(
			sql="SELECT id FROM users WHERE eMail=%s LIMIT 1;",
			params=(request.form["eMail"],),
			fetchOne=True
		)

		if id is False: return response(type="error", message="databaseError")

		if not id: return response(type="error", message="eMailNotFound")

		######## Link for passwordRecoveries
		token = secrets.token_urlsafe(16)

		ip_address_first = request.remote_addr
		user_agent_first = request.headers.get('User-Agent')


		data = MySQL.execute(
			sql="INSERT INTO password_recoveries (user, token, ip_address_first, user_agent_first) VALUES (%s, %s, %s, %s)",
			params=(id['id'], token, ip_address_first, user_agent_first),
			commit=True
		)

		if data is False: return response(type="error", message="databaseError")

		link = f'/resetPwd/{token}'

		# Send email to the user with a link like: /resetPwd/token | Use sednGrid here
		print('############## TOKEN ###################')
		print(link)
		print('#################################')

		return response(type="success", message="An email with password reset instructions has been sent to you.")