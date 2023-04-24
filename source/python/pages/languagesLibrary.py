# Flask
from main import app, request, render_template

# Home Made
from main import CONF, PROJECT_CSS

from python.modules.tools import pageGuard

#################################################### Demo
@app.route("/languagesLibrary", methods=["GET"])
@pageGuard("languagesLibrary")
def languagesLibrary():
    if request.method == "GET": return render_template("index.html", **globals())
