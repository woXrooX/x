# Flask
from __main__ import app, request, render_template

# Home Made
from __main__ import CONF, EXTERNALS

from python.tools.tools import pageGuard

#################################################### Demo
@app.route("/languagesLibrary", methods=["GET"])
@pageGuard("languagesLibrary")
def languagesLibrary():
    if request.method == "GET": return render_template("index.html", **globals())
