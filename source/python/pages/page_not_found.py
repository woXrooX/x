# Flask
from __main__ import app, render_template

# Home Made
from __main__ import CONF


#################################################### none | 404 | Page Not Found
@app.errorhandler(404)
def page_not_found(error):
    return render_template("index.html", **globals())
