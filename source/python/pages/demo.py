# Flask
from main import app, request, render_template

# Home Made
from main import CONF, PROJECT_CSS

from python.modules.tools import pageGuard

#################################################### Demo
@app.route("/demo", methods=["GET"])
@pageGuard("demo")
def demo():
    if request.method == "GET": return render_template("index.html", **globals())
