from main import app, request, render_template
from python.modules.tools import pageGuard
from python.modules.Globals import Globals

#################################################### Demo
@app.route("/languagesLibrary", methods=["GET"])
@pageGuard("languagesLibrary")
def languagesLibrary():
    if request.method == "GET": return render_template("index.html", **globals())
