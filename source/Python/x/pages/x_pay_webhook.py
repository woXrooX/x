from main import app, request

from Python.x.modules.Payment_System.Webhook import Webhook

@app.route("/x/pay/webhook", methods=["POST"])
def x_pay_webhook():
	return Webhook.handle_event(
		request.data.decode("utf-8"),
		request.headers.get("Stripe-Signature", None)
	)
