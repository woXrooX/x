from main import app, session, send_from_directory, abort
from Python.x.modules.Globals import Globals

@app.route("/JavaScript/pages/<path:FILE>", methods=["GET"])
def files_javascript_pages(FILE):
	if "user" in session:
		if "root" in session["user"]["roles"]:
			try: return send_from_directory(f"{Globals.X_PATH}/JavaScript_pages/", path=FILE, as_attachment=False)
			except: return abort(404)

		PAGE_CONF = Globals.CONF["pages"][FILE.split(".")[0]]

		if "authenticity_statuses" in PAGE_CONF:
			if "unauthenticated" in PAGE_CONF["authenticity_statuses"]: return abort(400)

			if session["user"]["authenticity_status"] not in PAGE_CONF["authenticity_statuses"]: return abort(400)

		if("roles" in PAGE_CONF and set(PAGE_CONF["roles"]).isdisjoint(set(session["user"]["roles"]))): return abort(400)

		if("roles_not" in PAGE_CONF and set(PAGE_CONF["roles_not"]).intersection(set(session["user"]["roles"]))): return abort(400)

		if("plans" in PAGE_CONF and session["user"]["plan"] not in PAGE_CONF["plans"]): return abort(400)

		try: return send_from_directory(f"{Globals.X_PATH}/JavaScript_pages/", path=FILE, as_attachment=False)
		except: return abort(404)

	if "user" not in session:
		if(
			(
				"authenticity_statuses" not in PAGE_CONF or
				"authenticity_statuses" in PAGE_CONF and
				"unauthenticated" in PAGE_CONF["authenticity_statuses"]
			) and
			"roles" not in PAGE_CONF and
			"plans" not in PAGE_CONF
		):
			try: return send_from_directory(f"{Globals.X_PATH}/JavaScript_pages/", path=FILE, as_attachment=False)
			except: return abort(404)

		else:
			if request.method == "GET": return redirect(f"/log_in?redirect=/JavaScript_pages/{FILE}")
			return Response.make(type="error", message="400", redirect=f"/log_in?redirect=/JavaScript_pages/{FILE}")

	try: return send_from_directory(f"{Globals.X_PATH}/JavaScript_pages/", path=FILE, as_attachment=False)
	except: return abort(404)