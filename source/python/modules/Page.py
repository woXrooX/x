if __name__ != "__main__":
	from functools import wraps # For page.guard() Wrapper
	"""
		@wraps(func)

		The functools.wraps function is a decorator used to preserve metadata of a decorated function,
		such as the name, docstring, and argument signature, to the wrapped function.
		When you use the functools.wraps decorator,
		it takes the original function as an argument and returns a new function that has the same metadata as the original function.

	"""


	from main import app, request, render_template, redirect, url_for, session
	from python.modules.Globals import Globals
	from python.modules.Logger import Log
	from python.modules.response import response

	class Page():
		@staticmethod
		def build():
			def decorator(func):
				page_name = func.__name__
				@wraps(func)
				def wrapper(*args, **kwargs):
					guard_result = Page.guard(page_name)

					if guard_result is True:
						# If it is a "GET" request, it will always just returns the "index.html"
						if request.method == "GET": return render_template("index.html", **globals())
						else: return func(*args, **kwargs, request=request)

					else: return guard_result

				# Check if page exists In CONF["pages"] the ncreate the routes
				if page_name in Globals.CONF["pages"]:
					# If no methods, then methods = ["GET"]
					methods = Globals.CONF["pages"][page_name].get("methods", ["GET"])

					#### Url args
					# @app.route("/page/<arg1>/<arg2>", methods=["GET", "POST"])
					args = ""

					# If the "urlArgs" key exists then loop and construct the "args" for the page "page_name"
					for arg in Globals.CONF["pages"][page_name].get("urlArgs", []): args = f"{args}/<{arg}>"

					for endpoint in Globals.CONF["pages"][page_name]["endpoints"]: app.add_url_rule(f"{endpoint}{args}", view_func=wrapper, methods=methods)

				return wrapper

			return decorator

		# Returns True if passes
		# Returns function if fails
		@staticmethod
		def guard(page):
			##################### POST
			if request.method == "POST":
				### App Is Down
				if "appIsDown" in Globals.CONF["default"]:
					Log.warning("App Is Down")
					return response(type="warning", message="appIsDown")

				### "application/json"
				if request.content_type == "application/json":
					# Invalid JSON
					if request.get_json() is None:
						Log.warning("Invalid JSON request")
						return response(type="warning", message="invalidRequest")

					# Check if "for" in request
					if "for" not in request.get_json():
						Log.warning("Missing 'for' in request JSON")
						return response(type="warning", message="invalidRequest")


				### "multipart/form-data"
				# "multipart/form-data" will include boundary, which is not const value
				# That's why we need to extract "multipart/form-data" then compare it
				# Ex. "multipart/form-data; boundary=----WebKitFormBoundaryqZq6yAWEgk6aywYg"
				# Check If "for" In Request
				if "multipart/form-data" in request.content_type.split(';'):
					if "for" not in request.form:
						Log.warning("Missing 'for' in request form data")
						return response(type="warning", message="invalidRequest")


			##################### GET

			####### App Is Down
			if "appIsDown" in Globals.CONF["default"]: return render_template("index.html", **globals())


			# NOTE: Already done inside Page.build()
			# Check If Page Exists In CONF["pages"]
			# if page not in Globals.CONF["pages"]: return redirect(url_for("home"))


			# Is Page Enabled
			if Globals.CONF["pages"][page]["enabled"] == False: return redirect(url_for("home"))


			# Everyone
			if(
				"authenticity_statuses" not in Globals.CONF["pages"][page] and
				"roles" not in Globals.CONF["pages"][page] and
				"plans" not in Globals.CONF["pages"][page]
			): return True


			# Session dependent checks
			if "user" in session:
				# Root
				if "root" in session["user"]["roles"]: return True


				#### Authenticity statuses
				authenticity_check = False
				if "authenticity_statuses" in Globals.CONF["pages"][page]:
					for user_authenticity_status in Globals.USER_AUTHENTICITY_STATUSES:
						if(
							session["user"]["authenticity_status"] == Globals.USER_AUTHENTICITY_STATUSES[user_authenticity_status]["id"] and
							user_authenticity_status in Globals.CONF["pages"][page]["authenticity_statuses"]
						):	authenticity_check = True

				else: authenticity_check = True


				#### Roles
				role_check = False
				if "roles" in Globals.CONF["pages"][page]:

					# Check if one of the user assigned rules match with the CONF[page]["roles"]
					if any(role in Globals.CONF["pages"][page]["roles"] for role in session["user"]["roles"]): role_check = True

				else: role_check = True


				#### Plans - similar to role check
				plan_check = True # Should be false in actual implementation


				#### Final check: IF all checks passed
				if(
					authenticity_check is True and
					role_check is True and
					plan_check is True
				): return True


			# Session independent checks
			if "user" not in session:

				#### Authenticity Statuses
				authenticity_check = False
				if(
					"authenticity_statuses" not in Globals.CONF["pages"][page] or
					"authenticity_statuses" in Globals.CONF["pages"][page] and
					"unauthenticated" in Globals.CONF["pages"][page]["authenticity_statuses"]
				): authenticity_check = True

				#### Roles
				role_check = False
				if "roles" not in Globals.CONF["pages"][page]: role_check = True

				#### Plans
				plan_check = False
				if "plans" not in Globals.CONF["pages"][page]: plan_check = True

				#### Final Check: IF all checks passed
				if(
					authenticity_check is True and
					role_check is True and
					plan_check is True
				): return True

			# Failed The Guard Checks
			return redirect(url_for("home"))
