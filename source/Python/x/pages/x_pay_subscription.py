from main import session

from Python.x.modules.Page import Page
from Python.x.modules.response import response
from Python.x.modules.Globals import Globals
from Python.x.modules.Stripe.Payment import Payment
from Python.x.modules.Stripe.Product import Product

@Page.build()
def x_pay_subscription(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_product":
				# Your logic goes here
				return response(type="success", message="success", data=Product.subscription_products["sample_one"])

			if request.get_json()["for"] == "get_publishable_key": return response(type="success", message="success", data=Globals.CONF["Stripe"]["publishable_key"])

			if request.get_json()["for"] == "create_payment_intent":
				return Payment.create_payment_intent(
					amount=Product.subscription_products["sample_one"]["amount"],
					currency=Product.subscription_products["sample_one"]["currency"],
					automatic_payment_methods={'enabled': True}
				)
