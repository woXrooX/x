from main import app, request, render_template
from python.modules.tools import pageGuard
from python.modules.Globals import Globals

#################################################### App Is Down
@app.route("/appIsDown", methods=["GET"])
@pageGuard("appIsDown")
def appIsDown():
    if request.method == "GET": return render_template("index.html", **globals())
