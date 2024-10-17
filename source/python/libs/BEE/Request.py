if __name__ != "__main__":
	import threading
	from functools import wraps
	import json
	import cgi
	from http.cookies import SimpleCookie
	from urllib.parse import parse_qs

	class Request:
		def __init__(self, environ):
			self.environ = environ
			self.method = environ.get("REQUEST_METHOD", '')
			self.path = environ.get("PATH_INFO", '')
			self.query_string = environ.get("QUERY_STRING", '')
			self.content_type = environ.get("CONTENT_TYPE", '')
			self.content_length = int(environ.get("CONTENT_LENGTH", 0))

			self.process_JSON_data()
			self.process_form_data()
			self.process_cookies()


		def get_body(self):
			if self.content_length: return self.environ['wsgi.input'].read(self.content_length)
			return b''

		def get_query_params(self): return parse_qs(self.query_string)


		def process_JSON_data(self):
			self.JSON_data = None
			if self.content_type == 'application/json': self.JSON_data = json.loads(self.get_body().decode('utf-8'))

		def process_form_data(self):
			self.form_data = None

			if not self.content_length: return

			if "multipart/form-data" in self.content_type.split(';'):
				self.form_data = {}
				raw_form_data = cgi.FieldStorage(environ=self.environ, fp=self.environ['wsgi.input'], keep_blank_values=True)

				# file_data = raw_form_data['some_file'].file.read()
				# filename = raw_form_data['some_file'].filename

				for key in raw_form_data: self.form_data[key] = raw_form_data.getvalue(key)


		def process_cookies(self): self.cookies = SimpleCookie(self.environ.get("HTTP_COOKIE", ''))


	##################### Context
	class Local_Storage:
		def __init__(self): self._storage = {}

		def __getattr__(self, name):
			thread_id = threading.get_ident()
			if thread_id not in self._storage: raise RuntimeError("Accessing context outside of a request")
			return self._storage[thread_id][name]

		def __setattr__(self, name, value):
			if name == '_storage': super().__setattr__(name, value)
			else:
				thread_id = threading.get_ident()
				if thread_id not in self._storage: raise RuntimeError("Accessing context outside of a request")
				self._storage[thread_id][name] = value

		def __delattr__(self, name):
			thread_id = threading.get_ident()
			if thread_id not in self._storage: raise RuntimeError("Accessing context outside of a request")
			del self._storage[thread_id][name]

	class Request_Proxy:
		def __init__(self): self._request = None

		def set(self, req): self._request = req

		def __getattr__(self, name):
			if self._request is None: raise RuntimeError("Request accessed outside of request context")
			return getattr(self._request, name)

		def __repr__(self):
			return (
				f"--- Request ---\n"
				f"method: {self.method}\n"
				f"path: {self.path}\n"
				f"query_string: {self.query_string}\n"
				f"content_type: {self.content_type}\n"
				f"content_length: {self.content_length}\n"
			)

	_local_storage = Local_Storage()

	request = Request_Proxy()

	def request_context(func):
		@wraps(func)
		def wrapper(*args, **kwargs):
			thread_id = threading.get_ident()
			_local_storage._storage[thread_id] = {'session': {}}

			try: return func(*args, **kwargs)
			finally:
				del _local_storage._storage[thread_id]
				request.set(None)

		return wrapper

	# Helper function to check if we're in a request context
	def require_request_context(func):
		@wraps(func)
		def wrapper(*args, **kwargs):
			if threading.get_ident() not in _local_storage._storage: raise RuntimeError("This function can only be called within a request context")
			return func(*args, **kwargs)
		return wrapper
