from main import app, send_from_directory, abort

from Python.x.modules.Globals import Globals
from Python.x.modules.Page import Page

@app.route("/files/live_pages/front/<string:PAGE_NAME>", methods=["GET"])
def files_live_pages_front(PAGE_NAME):
	guard_result = Page.guard(PAGE_NAME)
	if guard_result is not True: return guard_result

	try: return send_from_directory(f"{Globals.X_PATH}/live_pages/front/", path=f"{PAGE_NAME}.js", as_attachment=False)
	except: return abort(404)

