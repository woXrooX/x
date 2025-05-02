if __name__ != "__main__":
	from Python.x.modules.response import response
	from Python.x.modules.Globals import Globals

	import stripe
	stripe.api_key = Globals.CONF["Stripe"]["secret_key"]

	class Payment:
		@staticmethod
		def create_payment_intent(
			amount,

			# "usd", "gbp"
			currency = None,
			automatic_payment_methods = {'enabled': True},

			# {
			# 	"key_1": "value_1",
			# 	"key_2": "value_2"
			# }
			metadata = None,
			receipt_email = None
		):
			try:
				Stripe_object = stripe.PaymentIntent.create(
					amount=amount,
					currency=currency,
					automatic_payment_methods=automatic_payment_methods,
					metadata=metadata,
					receipt_email=receipt_email
				)

				return response(type="success", message="success", data=Stripe_object.client_secret)

			except stripe.error.StripeError as e: return response(type="error", message=str(e), HTTP_response_status_code=400)
			except Exception as e: return response(type="error", message=str(e), HTTP_response_status_code=500)

			return response(type="error", message="unknown_error")

