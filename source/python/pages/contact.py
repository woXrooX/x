# Flask
from __main__ import app, request, render_template, make_response

# Utils
from __main__ import json

# Home Made
from __main__ import conf, pageGuard

#################################################### Contact
@app.route("/contact", methods=["GET", "POST"])
@pageGuard("contact")
def contact():
    if request.method == "GET": return render_template("index.html", **globals())

    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)
