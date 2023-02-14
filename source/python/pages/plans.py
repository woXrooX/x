# Flask
from __main__ import app, request, render_template, make_response

# Home Made
from __main__ import conf, pageGuard


#################################################### Plans & Pricing
@app.route("/plans", methods=["POST"])
@app.route("/pricing", methods=["POST"])
@app.route("/plansAndPricing", methods=["POST"])
@pageGuard("plans")
def plansAndPricing():
    pass
