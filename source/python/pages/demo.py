# Flask
from __main__ import app, request, render_template

# Home Made
from __main__ import conf


#################################################### Demo
@app.route("/demo", methods=["GET"])
def demo():
    if request.method == "GET": return render_template("index.html", **globals())
