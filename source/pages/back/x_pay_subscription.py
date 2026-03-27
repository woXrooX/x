# Events to look at:
# invoice.payment_succeeded -> When subscription paid
# invoice.payment_failed -> Payment failed, notify the user
# customer.subscription.deleted -> Subscription cancelled

from main import session

from Python.x.modules.Page import Page
from Python.x.modules.Response import Response
from Python.x.modules.Globals import Globals
from Python.x.modules.Stripe.Payment import Payment
from Python.x.modules.Stripe.Product import Product

# @Page.build({
# 	"enabled": False,
# 	"methods": ["GET", "POST"],
# 	"endpoints": ["/x/pay/subscription/<subscription_name>"]
# })
@Page.build()
def x_pay_subscription(request, subscription_name):
	if subscription_name not in Product.subscription_products: return Response.make(type="error", message="invalid_request")

	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_product":
				# Your logic goes here
				return Response.make(type="success", message="success", data=Product.subscription_products[subscription_name])

			if request.get_json()["for"] == "get_publishable_key": return Response.make(type="success", message="success", data=Globals.CONF["Stripe"]["publishable_key"])

			if request.get_json()["for"] == "create_subscription":
				return Payment.create_subscription(subscription_name)
