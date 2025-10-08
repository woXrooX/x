# Final event to handle for one time payment
# Fires the moment the funds are captured. It’s emitted for all PaymentIntent‑based charges, including ones created for Checkout or Subscriptions.
# payment_intent.succeeded

from main import session

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.Globals import Globals
from Python.x.modules.Stripe.Payment import Payment
from Python.x.modules.Stripe.Product import Product

@Page.build({
	"enabled": False,
	"methods": ["GET", "POST"],
	"endpoints": ["/x/pay/one_time"]
})
def x_pay_one_time(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_product":
				# Your logic goes here
				return response(type="success", message="success", data=Product.one_time_products["sample_one"])

			if request.get_json()["for"] == "get_publishable_key": return response(type="success", message="success", data=Globals.CONF["Stripe"]["publishable_key"])

			if request.get_json()["for"] == "create_intent":
				return Payment.create_intent(
					amount=Product.one_time_products["sample_one"]["amount"],
					currency=Product.one_time_products["sample_one"]["currency"],
					automatic_payment_methods={'enabled': True}
				)
