if __name__ != "__main__":
	import secrets

	from main import session

	from Python.x.modules.Response import Response

	def get_CSRF_token():
		if "CSRF_token" not in session: session["CSRF_token"] = secrets.token_hex(32)
		return session["CSRF_token"]

	def validate_CSRF_token(incoming_token):
		stored_token = session.get("CSRF_token")

		if incoming_token is None or stored_token is None: return False

		# NOTE: Generating string, expecting string
		if not isinstance(incoming_token, str) or not isinstance(stored_token, str): return False

		# secrets.compare_digest() prevents timing analysis
		if secrets.compare_digest(incoming_token, stored_token): return True

		return False
