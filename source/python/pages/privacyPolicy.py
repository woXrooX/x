# Flask
from __main__ import app, request, render_template

# Home Made
from __main__ import CONF, pageGuard

#################################################### Privacy Policy
@app.route("/privacyPolicy", methods=["GET"])
@pageGuard("privacyPolicy")
def privacyPolicy():
    if request.method == "GET": return render_template("index.html", **globals())
