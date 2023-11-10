from main import app, render_template
from python.modules.Globals import Globals

#################################################### none | 404 | Page Not Found
@app.errorhandler(404)
def page_not_found(error):
    return render_template("index.html", **globals())
