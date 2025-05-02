import stripe

from main import app, request

from Python.x.modules.Logger import Log
from Python.x.modules.Payment_System.Webhook import Webhook
from Python.x.modules.Globals import Globals

@app.route("/x/pay/webhook", methods=["POST"])
def x_pay_webhook():
	payload = request.data.decode("utf-8")
	signature = request.headers.get("Stripe-Signature", None)

	try:
		event = stripe.Webhook.construct_event(
			payload=payload,
			sig_header=signature,
			secret=Globals.CONF["Stripe"]["webhook_secret"]
		)
		data = event["data"]

	except ValueError:
		Log.error("x_pay_webhook: Error while decoding event!")
		return "Bad payload", 400

	except stripe.error.SignatureVerificationError:
		Log.error("x_pay_webhook: Invalid signature!")
		return "Bad signature", 400

	except Exception as e:
		Log.error(f"x_pay_webhook: {e}")
		return "Error", 400

	obj = event["data"]["object"]

	# Log.line('>')
	# Log.raw(f"Event type: {event['type']}\nEvent ID: {event.id}\nObject ID: {obj.id}\nObject status: {obj.status}")
	# Log.line('|')
	# print(event)
	# Log.line('<')


	if event["type"] == "payment_intent.canceled":
		if Webhook.payment_intent_canceled(obj.id, event["type"], obj.status) is False: Log.error("/x/pay/webhook: payment_intent.canceled -> database_error")

	if event["type"] == "charge.failed":
		if Webhook.charge_failed(obj.payment_intent, event["type"], obj.status) is False: Log.error("/x/pay/webhook: charge.failed -> database_error")

	if event["type"] == "payment_intent.payment_failed":
		if Webhook.payment_intent_payment_failed(obj.id, event["type"], obj.status) is False: Log.error("/x/pay/webhook: payment_intent.payment_failed -> database_error")

	if event["type"] == "payment_intent.succeeded":
		if Webhook.payment_intent_succeeded(obj.id, event["type"], obj.status) is False: Log.error("/x/pay/webhook: payment_intent.succeeded -> database_error")

	if event["type"] == "charge.succeeded":
		if Webhook.charge_succeeded(obj.payment_intent, event["type"], obj.status, obj.amount) is False: Log.error("/x/pay/webhook: charge.succeeded -> database_error")


	return "OK", 200
