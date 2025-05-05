if __name__ != "__main__":
	from main import session

	from Python.x.modules.response import response
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log
	from Python.x.modules.MySQL import MySQL

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
				existing_customer = Customer.get_customer_id_by_user_id(user_id)
				if existing_customer is not None: return existing_customer

				if metadata is None: metadata = {}
				metadata["user_id"] = str(user_id)

				params = {
					"email": eMail,
					"metadata": metadata,
					"name": fullname,
					"payment_method": payment_method
				}

				customer = stripe.Customer.create(**params)

				link_users_Stripe_customers = MySQL.execute(
					sql="INSERT INTO users_Stripe_customers (user, Stripe_customer_id) VALUES (%s, %s);",
					params=[
						user_id,
						customer.id
					],
					commit=True
				)
				if link_users_Stripe_customers is False:
					Log.error(f"Payment.create_customer(): database_error")
					return False

				Log.success("Payment.create_customer(): customer_created")

				return customer.id

			except stripe.error.StripeError as e:
				Log.error(f"Payment.create_customer(): StripeError -> {e}")
				return False

			except Exception as e:
				Log.error(f"Payment.create_customer(): Exception -> {e}")
				return False

		@staticmethod
		def get_customer_id_by_user_id(user_id):
			data = MySQL.execute(
				sql="SELECT Stripe_customer_id FROM users_Stripe_customers WHERE user = %s LIMIT 1;",
				params=[user_id],
				fetch_one=True
			)
			if data is False: return False
			if data is None: return None

			return data["Stripe_customer_id"]

		@staticmethod
		def find_customer_by_user_id(user_id, limit=100):
			str_user_id = str(user_id)

			try:
				customers = stripe.Customer.list(limit=limit)

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
