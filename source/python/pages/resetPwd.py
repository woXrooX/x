import hashlib
from datetime import datetime

from main import redirect
from python.modules.Page import Page
from python.modules.response import response
from python.modules.Globals import Globals
from python.modules.MySQL import MySQL

@Page.build()
def resetPwd(request, TOKEN):
	
	data = MySQL.execute(
		sql="SELECT timestamp_first FROM password_recoveries WHERE token=%s LIMIT 1;",
		params=(TOKEN,),
		fetchOne=True
	)


	if data is False: return response(type="error", message="databaseError")

	if not data: return response( type="error", message="error", redirect="/404")


	#Check Time Validation
	format = '%Y-%m-%d %H:%M:%S'
	first = datetime.strptime(str(data['timestamp_first']), format)
	now = datetime.strptime(str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')), format)
	time_delta = now - first
	time_delta_mins = time_delta.total_seconds() / 60

	if time_delta_mins > 15: return response(type="error", message="expiredToken")
	
	if request.method == "POST":
		# unknownError
		if request.form["for"] != "resetPwd":
			return response(type="warning", message="unknownError")
		
		# passwordEmpty
		if "password" not in request.form or not request.form["password"]: return response(type="error", message="passwordEmpty", field="password")
		
		# passwordEmpty
		if "confirm_password" not in request.form or not request.form["confirm_password"]: return response(type="error", message="confirmPasswordEmpty", field="confirm_password")
		
		# Passwords do not match
		if request.form["password"] != request.form["confirm_password"]: return response(type="error", message="Passwords do not match", field="confirm_password")

		id = MySQL.execute(
			sql="SELECT user FROM password_recoveries WHERE token=%s LIMIT 1",
			params=(TOKEN,),
			fetchOne=True
		)

		if id is False: return response(type="error", message="databaseError")

		if Globals.CONF["password"]["hashing_algorithm"] == "SHA-256": new_password = hashlib.sha256(request.form["password"].encode()).hexdigest()
		else: new_password = request.form["password"]

		print('############## TOKEN ###################')
		print(id)
		print('#################################')
		#Updating users password
		data = MySQL.execute(
			sql="UPDATE users SET password=%s WHERE id=%s",
			params=(new_password, id['user']),
			commit=True
		)

		if data is False: return response(type="error", message="databaseError")

		#Writing all data to the password_recoveries
		ip_address_last = request.remote_addr
		user_agent_last = request.headers.get('User-Agent')

		old_password = MySQL.execute(
			sql="SELECT password FROM users WHERE id=%s LIMIT 1",
			params=(id['user'],),
			fetchOne=True
		)

		data = MySQL.execute(
			sql="UPDATE password_recoveries  SET ip_address_last = %s, user_agent_last = %s, password_old = %s, password_new = %s WHERE token = %s",
			params=(ip_address_last, user_agent_last, old_password['password'], new_password, TOKEN),
			commit=True
		)

		if data is False: return response(type="error", message="databaseError")


		return response(type="success", message="passwordChangedSuccessfully", redirect="/logIn")