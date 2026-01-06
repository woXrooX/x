if __name__ != "__main__":
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log

	import json
	from typing import NamedTuple

	class Response(NamedTuple):
		body: str
		status: int
		headers: dict

		@staticmethod
		def make(
			# Response Type
			type = "error",

			# Response Message (By Keyword)
			message = "invalid_keyword",

			# Form Related Field
			field = False,

			# Custom Data
			data = {},

			#### Actions

			update_conf = False,

			set_session_user = False,
			delete_session_user = False,

			DOM_change = [],

			redirect = False,
			reload = False,
			open_URL_in_new_tab = False,

			# Function to use for converting non-serializable objects to a serializable JSON format.
			default_serializer_func = None,

			# HTTP Response Status Code
			HTTP_response_status_code = 200,
			headers = None,

			RAW = False
		):
			######## RAW
			# Sample: RAW=('body', 200, {'header_key': 'header_val'})
			if RAW:
				if not isinstance(RAW, tuple) or len(RAW) != 3: raise ValueError("Response.make(): RAW must be a (body, status, headers) tuple")

				RAW_body, RAW_status, RAW_headers = RAW
				return Response(RAW_body, RAW_status, RAW_headers)

			######## Type
			# Check if type is valid
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
			# Check if field argument is not falsy
			# NOTE: If HTML field name, id or selector equals to falsy value then this check will ignore it
			if field is not False: response_dict["field"] = field

			######## Data
			if data: response_dict["data"] = data

			######## Actions
			actions_dict = {}

			if update_conf: actions_dict["update_conf"] = PUBLIC_CONF

			if set_session_user is True:
				# Due to circular import, we put the import here
				from Python.x.modules.User import User
				actions_dict["set_session_user"] = User.generate_public_session()

			if delete_session_user is True: actions_dict["delete_session_user"] = 0

			if DOM_change: actions_dict["DOM_change"] = DOM_change

			if redirect: actions_dict["redirect"] = redirect
			if reload: actions_dict["reload"] = 0
			if open_URL_in_new_tab: actions_dict["open_URL_in_new_tab"] = open_URL_in_new_tab

			# Check If Actions Has At Least One Object
			if actions_dict: response_dict["actions"] = actions_dict


			# print("----------------------- response_dict -----------------------")
			# print(response_dict)

			if headers is None: headers = {'Content-Type': 'application/json'}

			# Final Response -> body, status, headers
			body = json.dumps(response_dict, default=default_serializer_func)
			return Response(body, HTTP_response_status_code, headers)
