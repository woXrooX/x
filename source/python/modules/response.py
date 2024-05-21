if __name__ != "__main__":
	from python.modules.Globals import Globals
	from python.modules.User import User

	import json

	def response(
		# Response Type
		type="error",

		# Response Message (By Keyword)
		message="invalidKeyword",

		# Form Related Field
		field=False,

		# Custom Data
		data={},

		# Actions
		updateConf=False,
		setSessionUser=False,
		deleteSessionUser=False,
		domChange=[],
		redirect=False,
		reload=False,

		onFormGotResponse=False,

		# Function to use for converting non-serializable objects to a serializable JSON format.
		defaultSerializerFunc=None,

		# HTTP Response Status Code
		HTTP_response_status_code=200,
		headers={'Content-Type': 'application/json'}
	):
		######## Type
		# Check If Type Is Valid
		if type not in ["success", "info", "warning", "error"]: type = "error"

		######## Message
		# Looks like no need for this check here since Front-End Lang.use covers bugs
		# Check If Keyword Is Valid
		# if message not in langDict: message="invalidKeyword"

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

		## updateConf
		if updateConf: actionsDict["updateConf"] = PUBLIC_CONF

		## setSessionUser
		if setSessionUser is True: actionsDict["setSessionUser"] = User.generate_public_session()

		## deleteSessionUser
		if deleteSessionUser is True: actionsDict["deleteSessionUser"] = 0

		## domChange
		if domChange: actionsDict["domChange"] = domChange

		## redirect
		if redirect: actionsDict["redirect"] = redirect

		## reload
		if reload: actionsDict["reload"] = 0

		## Execute Function On Form Got Response
		if onFormGotResponse: actionsDict["onFormGotResponse"] = 0

		# Check If Actions Has At Least One Object
		if actionsDict: response_dict["actions"] = actionsDict


		# print("----------------------- response_dict -----------------------")
		# print(response_dict)


		# Final Response -> body, status, headers
		return json.dumps(response_dict, default=defaultSerializerFunc), HTTP_response_status_code, headers
