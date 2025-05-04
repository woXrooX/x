if __name__ != "__main__":
	from main import session

	from Python.x.modules.response import response
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log

	import stripe
	stripe.api_key = Globals.CONF["Stripe"]["secret_key"]

	class Customer:
		@staticmethod
		def create_customer(
			eMail,
			user_id,
			fullname=None,
			metadata=None,
			payment_method=None
		):
			try:
				if metadata is None: metadata = {}
				metadata['user_id'] = str(user_id)

				params = {
					"email": eMail,
					"metadata": metadata,
					"name": fullname,
					"payment_method": payment_method
				}

				customer = stripe.Customer.create(**params)

				Log.success("Payment.create_customer(): customer_created")
				return customer.id

			except stripe.error.StripeError as e:
				Log.error(f"Payment.create_customer(): StripeError -> {e}")
				return False

			except Exception as e:
				Log.error(f"Payment.create_customer(): Exception -> {e}")
				return False

		@staticmethod
		def find_customer_by_id(user_id):
			str_user_id = str(user_id)

			try:
				customers = stripe.Customer.list(limit=100)

				for customer in customers.data:
					if customer.metadata and customer.metadata.get('user_id') == str_user_id:
						return customer.id

				Log.info("Payment.find_customer_by_id(): customer_not_found")
				return None

			except stripe.error.StripeError as e:
				Log.error(f"Payment.find_customer_by_id(): StripeError -> {e}")
				return False

			except Exception as e:
				Log.error(f"Payment.find_customer_by_id(): Exception -> {e}")
				return False

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
