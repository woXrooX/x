# Flask
from __main__ import app, request, render_template, make_response

# Home Made
from __main__ import CONF, MySQL, pageGuard


#################################################### HOME | Index | Landing
@app.route("/", methods=["GET", "POST"])
@app.route("/home", methods=["GET", "POST"])
@pageGuard("home")
def home():
    if request.method == "GET": return render_template("index.html", **globals())


    elif request.method == "POST":
        return make_response(json.dumps({"response": "OK"}), 200)
