if __name__ != "__main__":
	import re
	import os

	from python.libs.BEE.Request import Request, request, request_context
	from python.libs.BEE.Sessions import session, get_session

	class Core:
		#### Defaults

		def __init__(self, www_path, index_html = ''):
			self.index_html = index_html
			self.www_path = www_path

			self.routes = {}
			# {
			# 	"compiled_path_pattern" : {
			# 		"handler_func": handler_func,
			# 		"URL_params": URL_params,
			# 		"methods": ["GET", "POST"]
			# 	}
			# }

		@request_context
		def __call__(self, environ, start_response):
			request.set(Request(environ))
			session.start()

			# print(">>>>>>>>>>>>>>>>>>>>>>>>")
			# print(request)
			# print(session)
			# print("<<<<<<<<<<<<<<<<<<<<<<<<")

			if request.method not in ["GET", "POST"]:
				start_response('405 Method Not Allowed', [('Content-Type', 'text/plain')])
				return [b'405 Method Not Allowed']

			start_response_headers = []

			if session.session_id is not None:
				session_cookie = session.get_cookie()
				if session_cookie: start_response_headers.append(('Set-Cookie', session_cookie))

			# Serve static files
			if request.method == "GET":
				match_for_static_file = re.search(r'\.[a-zA-Z]+$', request.path)
				if bool(match_for_static_file) is True:
					static_file = self.read_static_file(request.path)
					if static_file is not False:
						extension = match_for_static_file.group()

						match extension:
							case ".css":
								start_response_headers.append(('Content-Type', 'text/css'))
								start_response('200 OK', start_response_headers)
								return [static_file]

							case ".js":
								start_response_headers.append(('Content-Type', 'application/javascript'))
								start_response('200 OK', start_response_headers)
								return [static_file]

							case ".json":
								start_response_headers.append(('Content-Type', 'application/json'))
								start_response('200 OK', start_response_headers)
								return [static_file]

							case ".ttf":
								start_response_headers.append(('Content-Type', 'application/x-font-ttf'))
								start_response('200 OK', start_response_headers)
								return [static_file]

							case ".png":
								start_response_headers.append(('Content-Type', 'image/png'))
								start_response('200 OK', start_response_headers)
								return [static_file]

							case _:
								start_response_headers.append(('Content-Type', 'text/plain'))
								start_response('404 Not Found', start_response_headers)
								return [b'404 Not Found']


			for route_key, route_val in self.routes.items():
				match = route_key.match(request.path)

				if match:
					if request.method in route_val["methods"]:
						if request.method == "GET":
							start_response_headers.append(('Content-Type', 'text/html'))
							start_response('200 OK', start_response_headers)
							return [self.index_html]

						elif request.method == "POST":
							kwargs = dict(zip(route_val["URL_params"], match.groups()))
							resp = route_val["handler_func"](**kwargs)
							start_response(str(resp[1]), resp[2])
							return [resp[0].encode()]

			start_response('404 Not Found', [('Content-Type', 'text/plain')])
			return [b'404 Not Found']


		#### Helpers

		def set_route(self, path_pattern, handler_func, methods=["GET"]):
			compiled_pattern, URL_params = self.compile_route_path_pattern(path_pattern)

			self.routes[compiled_pattern] = {
				"handler_func": handler_func,
				"URL_params": URL_params,
				"methods": methods
			}

		def compile_route_path_pattern(self, path):
			param_pattern = r'<([^>]+)>'
			URL_params = re.findall(param_pattern, path)
			regex_pattern = re.sub(param_pattern, r'([^/]+)', path)
			return re.compile(f"^{regex_pattern}$"), URL_params

		def read_static_file(self, path):
			complete_path_and_file = f'{self.www_path}{path}'

			if not os.path.isfile(complete_path_and_file): return False

			try:
				with open(complete_path_and_file, 'rb') as file: return file.read()
			except Exception as e:
				print(e)
				return False


