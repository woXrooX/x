# Flask
from __main__ import app, request, render_template

# Home Made
from __main__ import CONF, EXTERNALS

from python.tools.tools import pageGuard

#################################################### App Is Down
@app.route("/appIsDown", methods=["GET"])
@pageGuard("appIsDown")
def appIsDown():
    if request.method == "GET": return render_template("index.html", **globals())
