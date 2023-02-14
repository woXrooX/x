# Flask
from __main__ import app, request, render_template

# Home Made
from __main__ import conf, pageGuard

#################################################### Terms Of Use
@app.route("/termsOfUse", methods=["GET"])
@pageGuard("termsOfUse")
def termsOfUse():
    if request.method == "GET": return render_template("index.html", **globals())
