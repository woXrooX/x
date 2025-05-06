from main import session

from Python.x.modules.Page import Page
from Python.x.modules.Stripe.Payment import Payment
from Python.x.modules.response import response
from Python.x.modules.Globals import Globals

@Page.build()
def x_pay(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			data = request.get_json()

			match data.get("for"):
				case "get_publishable_key": return response(type="success", message="success", data=Globals.CONF["Stripe"]["publishable_key"])

				case "create_payment_intent":
					return Payment.create_payment_intent(
						amount=1000,
						currency="usd",
						automatic_payment_methods={'enabled': True}
					)

				case _: return response(type="error", message="invalid_request")
