from Python.x.modules.Page import Page
from Python.x.modules.Payment_System.Payment import Payment

@Page.build()
def x_pay(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_publishable_key": return response(type="success", message="success", data=Globals.CONF["Stripe"]["publishable_key"])

			if request.get_json()["for"] == "create_payment_intent":
				return Payment.create_payment_intent(
					amount=1234,
					currency="gbp",
					automatic_payment_methods={'enabled': True},
					metadata={
						"key_1": "value_1",
						"key_2": "value_2"
					},
					receipt_email="sample@site.com"
				)
