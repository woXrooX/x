if __name__ != "__main__":
	import re

	class BEE:
		#### Defaults

		def __init__(self):

			self.routes = {}
			# {
			# 	"compiled_path_pattern" : {
			# 		"handler_func": handler_func,
			# 		"URL_params": URL_params,
			# 		"methods": ["GET", "POST"]
			# 	}
			# }

		def __call__(self, environ, start_response):
			PATH_INFO = environ["PATH_INFO"]
			REQUEST_METHOD = environ["REQUEST_METHOD"]

			if REQUEST_METHOD not in ["GET", "POST"]:
				start_response('405 Method Not Allowed', [('Content-Type', 'text/plain')])
				return [b'405 Method Not Allowed']

			for route_key, route_val in self.routes.items():
				match = route_key.match(PATH_INFO)

				if match:
					if REQUEST_METHOD in route_val["methods"]:
						if REQUEST_METHOD == "GET":
							kwargs = dict(zip(route_val["URL_params"], match.groups()))
							start_response('200 OK', [('Content-Type', 'text/html')])
							return [route_val["handler_func"](**kwargs).encode()]

						elif REQUEST_METHOD == "POST":
							pass
							# POST resp

			start_response('404 Not Found', [('Content-Type', 'text/plain')])
			return [b'404 Not Found']




		#### Decorators

		def route(self, path_pattern, methods=["GET"]):
			def decorator(handler_func):
				compiled_pattern, URL_params = self.compile_route_path_pattern(path_pattern)

				self.routes[compiled_pattern] = {
					"handler_func": handler_func,
					"URL_params": URL_params,
					"methods": methods
				}

				return handler_func

			return decorator




		#### Helpers

		def compile_route_path_pattern(self, path):
			param_pattern = r'<([^>]+)>'
			URL_params = re.findall(param_pattern, path)
			regex_pattern = re.sub(param_pattern, r'([^/]+)', path)
			return re.compile(f"^{regex_pattern}$"), URL_params

