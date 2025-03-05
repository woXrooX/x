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
	from Python.x.modules.response import response

	class Page():
		@staticmethod
		def build():
			def decorator(func):
				page_name = func.__name__
				@wraps(func)
				def wrapper(*args, **kwargs):
					guard_result = Page.guard(page_name)

					if guard_result is not True: return guard_result

					# If it is a "GET" request, it will always just returns the "index.html"
					if request.method == "GET": return render_template("index.html", **globals())

					ret_val = func(*args, **kwargs, request=request)
					if ret_val is None: return response(RAW=("No Response", 444, {'Content-Type': 'text/plain; charset=utf-8'}))
					return ret_val

				# Check if page exists In CONF["pages"] the ncreate the routes
				if page_name in Globals.CONF["pages"]:
					# If no methods, then methods = ["GET"]
					methods = Globals.CONF["pages"][page_name].get("methods", ["GET"])

					#### Url args
					# @app.route("/page/<arg1>/<arg2>", methods=["GET", "POST"])
					args = ""

					# If the "URL_args" key exists then loop and construct the "args" for the page "page_name"
					for arg in Globals.CONF["pages"][page_name].get("URL_args", []): args = f"{args}/<{arg}>"

					for endpoint in Globals.CONF["pages"][page_name]["endpoints"]: app.add_url_rule(f"{endpoint}{args}", view_func=wrapper, methods=methods)

				return wrapper

			return decorator

		# Returns True if passes
		# Returns function if fails
		@staticmethod
		def guard(page):
			if request.method not in ["POST", "GET"]: return response(RAW=("Method Not Allowed", 405, {'Content-Type': 'text/plain; charset=utf-8'}))

			if "app_is_down" in Globals.CONF["tools"]:
				Log.warning("App Is Down")
				if request.method == "GET": return render_template("index.html", **globals())
				return response(type="info", message="app_is_down")

			PAGE_CONF = Globals.CONF["pages"][page]

			if PAGE_CONF["enabled"] == False:
				if request.method == "GET": return redirect("/")
				return response(type="error", message="404", redirect="/404")

			# Validate POST request
			if request.method == "POST":
				if request.content_type == "application/json":
					if request.get_json() is None or "for" not in request.get_json():
						Log.warning("Invalid JSON request")
						return response(type="warning", message="invalid_request")

				if "multipart/form-data" in request.content_type.split(';'):
					if "for" not in request.form:
						Log.warning("Missing 'for' in request form data")
						return response(type="warning", message="invalid_request")

			if "user" in session:
				if "root" in session["user"]["roles"]: return True

				if "authenticity_statuses" in PAGE_CONF:
					if "unauthenticated" in PAGE_CONF["authenticity_statuses"]:
						if request.method == "GET": return redirect("/400")
						return response(type="error", message="400", redirect="/400")

					if session["user"]["authenticity_status"] not in PAGE_CONF["authenticity_statuses"]:
						if request.method == "GET": return redirect("/400")
						return response(type="error", message="400", redirect="/400")

				if(
					"roles" in PAGE_CONF and
					set(PAGE_CONF["roles"]).isdisjoint(set(session["user"]["roles"]))
				):
					if request.method == "GET": return redirect("/400")
					return response(type="error", message="400", redirect="/400")

				if(
					"roles_not" in PAGE_CONF and
					set(PAGE_CONF["roles_not"]).intersection(set(session["user"]["roles"]))
				):
					if request.method == "GET": return redirect("/400")
					return response(type="error", message="400", redirect="/400")

				if(
					"plans" in PAGE_CONF and
					session["user"]["plan"] not in PAGE_CONF["plans"]
				):
					if request.method == "GET": return redirect("/400")
					return response(type="error", message="400", redirect="/400")

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
					return response(type="error", message="400", redirect=f"/log_in?redirect={quote(request.path, safe='')}")

			return True
