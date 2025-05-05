from main import session

from Python.x.modules.Page import Page
from Python.x.modules.Payment_System.Payment import Payment
from Python.x.modules.response import response
from Python.x.modules.Globals import Globals

@Page.build()
def x_pay(request):
	if request.method == "POST" and request.content_type == "application/json":
		data = request.get_json()

		match data.get("for"):
			case "get_publishable_key": return response(type="success", message="success", data=Globals.CONF["Stripe"]["publishable_key"])

			case "create_payment_intent":
				return Payment.create_payment_intent(
					amount=1000,
					currency="usd",
					automatic_payment_methods={'enabled': True}
				)

			case "create_subscription":
				metadata = data.get("metadata", {})
				metadata["user_id"] = session["user"]["id"]

				return Payment.create_subscription(
					customer_id=data.get("customer_id"),
					price_id=data.get("price_id"),
					payment_method_id=data.get("payment_method_id"),
					metadata=metadata,
					trial_days=data.get("trial_days")
				)

			case "attach_payment_method":
				return Payment.attach_payment_method_to_customer(
					payment_method_id=data.get("payment_method_id"),
					customer_id=data.get("customer_id")
				)

			case _: return response(type="error", message="invalid_operation")
