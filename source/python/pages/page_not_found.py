# Flask
from __main__ import app, redirect, url_for


#################################################### none | 404 | Page Not Found
@app.errorhandler(404)
def page_not_found(error):
    return redirect(url_for("home"))
