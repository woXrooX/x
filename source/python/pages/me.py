# Flask
from __main__ import app, request, render_template, make_response

# Home Made
from __main__ import CONF, MySQL, pageGuard, session, publicSessionUser


#################################################### Me | MyPage
@app.route("/me", methods=["POST"])
@app.route("/myPage", methods=["POST"])
@pageGuard("me")
def me():
    pass
