if __name__ != "__main__":
	from main import session

	from Python.x.modules.response import response
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log
	from Python.x.modules.Stripe.Stripe import Stripe
	from Python.x.modules.Stripe.Customer import Customer
	from Python.x.modules.Stripe.Product import Product

	import stripe

	class Payment:
		@staticmethod
		def create_intent(
			amount,
			currency="usd",
			automatic_payment_methods={'enabled': True}
		):
			if Stripe.initialized is not True: return response(type="error", message="Stripe_is_not_initialized", HTTP_response_status_code=401)

			try:
				customer_id = Customer.create_customer()
				if customer_id is False:
					Log.error(f"Payment.create_intent(): could_not_create_customer")
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
				Log.error(f"Payment.create_intent(): StripeError -> {e}")
				return response(type="error", message=str(e), HTTP_response_status_code=400)

			except Exception as e:
				Log.error(f"Payment.create_intent(): Exception -> {e}")
				return response(type="error", message=str(e), HTTP_response_status_code=500)

		@staticmethod
		def create_subscription(subscription_name):
			if Stripe.initialized is not True: return response(type="error", message="Stripe_is_not_initialized", HTTP_response_status_code=401)

			if subscription_name not in Product.subscription_products: return response(type="error", message="invalid_request", HTTP_response_status_code=400)

			try:
				customer_id = Customer.create_customer()
				if customer_id is False:
					Log.error(f"Payment.create_subscription(): could_not_create_customer")
					return response(type="error", message=str(e), HTTP_response_status_code=500)

				subscription = stripe.Subscription.create(
					customer=customer_id,
					items=[{"price": Product.subscription_products[subscription_name]["price_id"]}],
					payment_behavior="default_incomplete",
					expand=["latest_invoice.payment_intent"]
				)

				# Pull out the PaymentIntent so the front‑end can confirm the payment
				payment_intent = subscription.latest_invoice.payment_intent

				response_data = {
					"subscriptionId": subscription.id,
					"clientSecret": payment_intent.client_secret,
					"status": payment_intent.status
				}

				return response(type="success", message="success", data=response_data)

			except stripe.error.StripeError as e:
				Log.error(f"Payment.create_subscription(): StripeError -> {e}")
				return response(type="error", message=str(e), HTTP_response_status_code=400)

			except Exception as e:
				Log.error(f"Payment.create_subscription(): Exception -> {e}")
				return response(type="error", message=str(e), HTTP_response_status_code=500)
