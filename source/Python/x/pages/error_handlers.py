from main import app, render_template, redirect
from Python.x.modules.Globals import Globals


@app.route('/400')
def code_400():	return render_template("index.html", **globals()), 400

@app.errorhandler(400)
def not_found(error): return redirect("/400")




@app.route('/403')
def code_403():	return render_template("index.html", **globals()), 403

@app.errorhandler(403)
def forbidden_error(error):	return redirect("/403")




@app.route('/404')
def code_404():	return render_template("index.html", **globals()), 404

@app.errorhandler(404)
def not_found(error): return redirect("/404")

