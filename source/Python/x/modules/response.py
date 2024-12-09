if __name__ != "__main__":
	from Python.x.modules.Globals import Globals
	from Python.x.modules.User import User

	import json

	def response(
		# Response Type
		type="error",

		# Response Message (By Keyword)
		message="invalid_keyword",

		# Form Related Field
		field=False,

		# Custom Data
		data={},

		# Actions
		update_conf=False,
		set_session_user=False,
		delete_session_user=False,
		dom_change=[],
		redirect=False,
		reload=False,

		# Function to use for converting non-serializable objects to a serializable JSON format.
		default_serializer_func=None,

		# HTTP Response Status Code
		HTTP_response_status_code=200,
		headers={'Content-Type': 'application/json'},

		RAW=False
	):
		######## RAW
		# Sample: RAW=('body', 200, {'header_key': 'header_val'})
		if RAW: return RAW

		######## Type
		# Check If Type Is Valid
		if type not in ["success", "info", "warning", "error"]: type = "error"

		######## Message
		# Looks like no need for this check here since Front-End Lang.use covers bugs
		# Check If Keyword Is Valid
		# if message not in langDict: message="invalid_keyword"

		######## Response Dict
		response_dict = {
			"type": type,
			"message": message,
		}

		######## Field
		# Check If Field Argument Is Not Falsy
		# NOTE: If html field name, id or selector equals to falsy value then this check will ignore it
		if field is not False: response_dict["field"] = field

		######## Data
		if data: response_dict["data"] = data

		######## Actions
		actionsDict = {}

		if update_conf: actionsDict["update_conf"] = PUBLIC_CONF

		if set_session_user is True: actionsDict["set_session_user"] = User.generate_public_session()

		if delete_session_user is True: actionsDict["delete_session_user"] = 0

		if dom_change: actionsDict["dom_change"] = dom_change

		## redirect
		if redirect: actionsDict["redirect"] = redirect

		## reload
		if reload: actionsDict["reload"] = 0

		# Check If Actions Has At Least One Object
		if actionsDict: response_dict["actions"] = actionsDict


		# print("----------------------- response_dict -----------------------")
		# print(response_dict)


		# Final Response -> body, status, headers
		return json.dumps(response_dict, default=default_serializer_func), HTTP_response_status_code, headers
