# Flask
from main import app, render_template

# Home Made
from main import CONF, EXTERNALS


#################################################### none | 404 | Page Not Found
@app.errorhandler(404)
def page_not_found(error):
    return render_template("index.html", **globals())
