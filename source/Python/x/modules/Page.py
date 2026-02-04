if __name__ != "__main__":
	from urllib.parse import quote
	from functools import wraps # For page.guard() Wrapper
	"""
		@wraps(func)

		The functools.wraps function is a decorator used to preserve metadata of a decorated function,
		such as the name, docstring, and argument signature, to the wrapped function.
		When you use the functools.wraps decorator,
		it takes the original function as an argument and returns a new function that has the same metadata as the original function.

	"""


	from main import app, request, render_template, redirect, url_for, session

	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log
	from Python.x.modules.Response import Response
	from Python.x.modules.CSRF import validate_CSRF_token

	class Page():
		@staticmethod
		def build(configuration = False):
			def decorator(func):
				page_name = func.__name__

				Page.configure(page_name, configuration)

				@wraps(func)
				def wrapper(*args, **kwargs):
					guard_result = Page.guard(page_name)

					if guard_result is not True: return guard_result

					if request.method == "GET":
						if Globals.CONF["pages"][page_name].get("has_SSR_HTML", False) is True: return func(*args, **kwargs, request=request)

						# If it is a "GET" request, it will always just returns the "index.html"
						return render_template("index.html", **globals())

					CSRF_token = request.headers.get("x-CSRF-token")
					if not CSRF_token: return Response.make(type="error", message="Missing x-CSRF-token header", HTTP_response_status_code=400)
					if validate_CSRF_token(CSRF_token) is False: return Response.make(type="error", message="Forbidden", HTTP_response_status_code=403)


					ret_val = func(*args, **kwargs, request=request)
					if ret_val is None: return Response.make(RAW=("No Response", 444, {'Content-Type': 'text/plain; charset=utf-8'}))
					return ret_val

				# Check if page exists In CONF["pages"] the ncreate the routes
				if page_name in Globals.CONF["pages"]:
					# If no methods, then methods = ["GET"]
					methods = Globals.CONF["pages"][page_name].get("methods", ["GET"])

					for endpoint in Globals.CONF["pages"][page_name]["endpoints"]: app.add_url_rule(f"{endpoint}", view_func=wrapper, methods=methods)

				return wrapper

			return decorator

		# Returns True if passes
		# Returns function if fails
		@staticmethod
		def guard(page):
			if request.method not in ["POST", "GET"]: return Response.make(RAW=("Method Not Allowed", 405, {'Content-Type': 'text/plain; charset=utf-8'}))

			if "app_is_down" in Globals.CONF["tools"]:
				Log.warning("App Is Down")
				if request.method == "GET": return render_template("index.html", **globals())
				return Response.make(type="info", message="app_is_down")

			PAGE_CONF = Globals.CONF["pages"][page]

			if PAGE_CONF["enabled"] == False:
				if request.method == "GET": return redirect("/")
				return Response.make(type="error", message="404", redirect="/404")

			# Validate POST request
			if request.method == "POST":
				if request.content_type == "application/json":
					if request.get_json() is None or "for" not in request.get_json():
						Log.warning("Invalid JSON request")
						return Response.make(type="warning", message="invalid_request")

				if "multipart/form-data" in request.content_type.split(';'):
					if "for" not in request.form:
						Log.warning("Missing 'for' in request form data")
						return Response.make(type="warning", message="invalid_request")

			if "user" in session:
				if "root" in session["user"]["roles"]: return True

				if "authenticity_statuses" in PAGE_CONF:
					if "unauthenticated" in PAGE_CONF["authenticity_statuses"]:
						if request.method == "GET": return redirect("/400")
						return Response.make(type="error", message="400", redirect="/400")

					if session["user"]["authenticity_status"] not in PAGE_CONF["authenticity_statuses"]:
						if request.method == "GET": return redirect("/400")
						return Response.make(type="error", message="400", redirect="/400")

				if(
					"roles" in PAGE_CONF and
					set(PAGE_CONF["roles"]).isdisjoint(set(session["user"]["roles"]))
				):
					if request.method == "GET": return redirect("/400")
					return Response.make(type="error", message="400", redirect="/400")

				if(
					"roles_not" in PAGE_CONF and
					set(PAGE_CONF["roles_not"]).intersection(set(session["user"]["roles"]))
				):
					if request.method == "GET": return redirect("/400")
					return Response.make(type="error", message="400", redirect="/400")

				if(
					"plans" in PAGE_CONF and
					session["user"]["plan"] not in PAGE_CONF["plans"]
				):
					if request.method == "GET": return redirect("/400")
					return Response.make(type="error", message="400", redirect="/400")

				return True

			if "user" not in session:
				if(
					(
						"authenticity_statuses" not in PAGE_CONF or
						"authenticity_statuses" in PAGE_CONF and
						"unauthenticated" in PAGE_CONF["authenticity_statuses"]
					) and
					"roles" not in PAGE_CONF and
					"plans" not in PAGE_CONF
				): return True

				else:
					if request.method == "GET": return redirect(f"/log_in?redirect={quote(request.path, safe='')}")
					return Response.make(type="error", message="400", redirect=f"/log_in?redirect={quote(request.path, safe='')}")

			return True

		@staticmethod
		def configure(page_name, configuration):
			if page_name in Globals.CONF["pages"]: return
			if not isinstance(configuration, dict): return

			Globals.CONF["pages"][page_name] = configuration
