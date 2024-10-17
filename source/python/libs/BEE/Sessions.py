if __name__ != "__main__":
	import uuid
	import time
	from http.cookies import SimpleCookie
	from python.libs.BEE.Request import require_request_context, _local_storage, request

	class Session_Store:
		def __init__(self):
			self._sessions = {}

		def create_session(self):
			session_id = str(uuid.uuid4())
			self._sessions[session_id] = {'data': {}, 'timestamp': time.time()}
			return session_id

		def get_session(self, session_id): return self._sessions.get(session_id)

		def update_session(self, session_id, data):
			if session_id in self._sessions: self._sessions[session_id]['data'] = data

		def delete_session(self, session_id): self._sessions.pop(session_id, None)


	class Session:
		def __init__(self, session_store):
			self.session_store = session_store
			self.session_id = None
			self.data = {}

		@require_request_context
		def start(self):
			if request.cookies is not None:
				request_cookies_session_id = request.cookies.get("session_id", None)
				if request_cookies_session_id is not None: self.session_id = request_cookies_session_id.value
			else: self.session_id = None

			if self.session_id is None: self.session_id = self.session_store.create_session()
			else:
				session = self.session_store.get_session(self.session_id)

				if session: self.data = session['data']
				else: self.session_id = self.session_store.create_session()

			_local_storage.session = self

		def save(self): self.session_store.update_session(self.session_id, self.data)

		def clear(self):
			self.data = {}
			self.save()

		def get_cookie(self):
			cookie = SimpleCookie()
			cookie['session_id'] = self.session_id
			cookie['session_id']['httponly'] = True
			cookie['session_id']['path'] = '/'
			return cookie.output(header='')

		def __getitem__(self, key): return self.data.get(key)

		def __setitem__(self, key, value):
			self.data[key] = value
			self.save()

		def __delitem__(self, key):
			del self.data[key]
			self.save()

		def __repr__(self): return f"--- Session ---\nsession_id: {self.session_id}\ndata: {self.data}"

	session = Session(Session_Store())

	@require_request_context
	def get_session(): return _local_storage.session
