from main import app, render_template, redirect

from Python.x.modules.Page import Page


#### 400

@Page.build({
	"enabled": True,
	"methods": ["GET", "POST"],
	"endpoints": ["/400"]
})
def HTTP_status_code_400():
	return Response.make(RAW=("Bad Request", 400, {'Content-Type': 'text/plain; charset=utf-8'}))

@app.errorhandler(400)
def bad_request_error(error): return redirect("/400")



#### 403

@Page.build({
	"enabled": True,
	"methods": ["GET", "POST"],
	"endpoints": ["/403"]
})
def HTTP_status_code_403():
	return Response.make(RAW=("Forbidden", 403, {'Content-Type': 'text/plain; charset=utf-8'}))

@app.errorhandler(403)
def forbidden_error(error):	return redirect("/403")



#### 404

@Page.build({
	"enabled": True,
	"methods": ["GET", "POST"],
	"endpoints": ["/404"]
})
def HTTP_status_code_404():
	return Response.make(RAW=("Not Found", 404, {'Content-Type': 'text/plain; charset=utf-8'}))

@app.errorhandler(404)
def not_found_error(error):	return redirect("/404")
