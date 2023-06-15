from main import app, request, render_template
from python.modules.pageGuard import pageGuard
from python.modules.Globals import Globals

#################################################### Demo
@app.route("/demo", methods=["GET"])
@pageGuard("demo")
def demo():
    if request.method == "GET": return render_template("index.html", **globals())
