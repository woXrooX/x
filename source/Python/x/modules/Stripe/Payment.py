if __name__ != "__main__":
	from main import session

	from Python.x.modules.response import response
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log
	from Python.x.modules.Stripe.Stripe import Stripe
	from Python.x.modules.Stripe.Customer import Customer

	import stripe

	class Payment:
		@staticmethod
		def create_payment_intent(
			amount,
			currency="usd",
			automatic_payment_methods={'enabled': True}
		):
			if Stripe.initialized is not True: return response(type="error", message="Stripe_is_not_initialized", HTTP_response_status_code=401)

			try:
				fullname = None
				if session["user"]["firstname"] and session["user"]["lastname"]: fullname = f"{session["user"]["firstname"]} {session["user"]["lastname"]}"

				customer_id = Customer.create_customer(
					session["user"]["eMail"],
					session["user"]["id"],
					fullname
				)

				if customer_id is False:
					Log.error(f"Payment.create_payment_intent(): could_not_create_customer")
					return response(type="error", message=str(e), HTTP_response_status_code=500)

				params = {
					"amount": amount,
					"currency": currency,
					"automatic_payment_methods": automatic_payment_methods,
					"metadata": {
						"user_id": session["user"]["id"]
					},
					"receipt_email": session["user"]["eMail"] or None,
					"customer": customer_id
				}

				payment_intent = stripe.PaymentIntent.create(**params)

				return response(type="success", message="success", data=payment_intent.client_secret)

			except stripe.error.StripeError as e:
				Log.error(f"Payment.create_payment_intent(): StripeError -> {e}")
				return response(type="error", message=str(e), HTTP_response_status_code=400)

			except Exception as e:
				Log.error(f"Payment.create_payment_intent(): Exception -> {e}")
				return response(type="error", message=str(e), HTTP_response_status_code=500)
