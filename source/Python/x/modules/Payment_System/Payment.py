if __name__ != "__main__":
	from main import session

	from Python.x.modules.response import response
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log
	from Python.x.modules.Payment_System.Customer import Customer

	import stripe
	stripe.api_key = Globals.CONF["Stripe"]["secret_key"]

	class Payment:
		@staticmethod
		def create_payment_intent(
			amount,
			currency="usd",
			automatic_payment_methods={'enabled': True}
		):
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

		@staticmethod
		def create_subscription(
			customer_id,
			price_id,
			payment_method_id=None,
			metadata=None,
			trial_days=None
		):
			try:
				subscription_params = {
					"customer": customer_id,
					"items": [{"price": price_id}],
					"metadata": metadata or {}
				}

				if payment_method_id: subscription_params["default_payment_method"] = payment_method_id
				if trial_days: subscription_params["trial_period_days"] = trial_days

				subscription = stripe.Subscription.create(**subscription_params)

				return response(
					type="success",
					message="subscription_created",
					data={
						"id": subscription.id,
						"status": subscription.status,
						"current_period_end": subscription.current_period_end
					}
				)

			except stripe.error.StripeError as e: return response(type="error", message=str(e), HTTP_response_status_code=400)
			except Exception as e: return response(type="error", message=str(e), HTTP_response_status_code=500)

		@staticmethod
		def get_payment_method(payment_method_id):
			try:
				payment_method = stripe.PaymentMethod.retrieve(payment_method_id)
				return response(type="success", message="payment_method_retrieved", data=payment_method)

			except stripe.error.StripeError as e: return response(type="error", message=str(e), HTTP_response_status_code=400)
			except Exception as e: return response(type="error", message=str(e), HTTP_response_status_code=500)

		@staticmethod
		def attach_payment_method_to_customer(payment_method_id, customer_id):
			try:
				payment_method = stripe.PaymentMethod.attach(
					payment_method_id,
					customer=customer_id
				)
				return response(type="success", message="payment_method_attached", data=payment_method)

			except stripe.error.StripeError as e: return response(type="error", message=str(e), HTTP_response_status_code=400)
			except Exception as e: return response(type="error", message=str(e), HTTP_response_status_code=500)
