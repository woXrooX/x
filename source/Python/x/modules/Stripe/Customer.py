if __name__ != "__main__":
	from main import session

	from Python.x.modules.response import response
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log
	from Python.x.modules.MySQL import MySQL
	from Python.x.modules.Stripe.Stripe import Stripe

	import stripe

	class Customer:

		# Returns existing customer_id if already exists
		@staticmethod
		def create_customer(
			metadata=None,
			payment_method=None
		):
			if Stripe.initialized is not True:
				Log.warning("Payment.create_customer(): Stripe_is_not_initialized")
				return False

			#### Session user data
			if "user" not in session: return False
			fullname = None
			if session["user"]["firstname"] and session["user"]["lastname"]: fullname = f'{session["user"]["firstname"]} {session["user"]["lastname"]}'

			try:
				existing_customer = Customer.get_customer_id_by_user_id(session["user"]["id"])
				if existing_customer is not None: return existing_customer

				if metadata is None: metadata = {}
				metadata["user_id"] = str(session["user"]["id"])

				params = {
					"email": eMail,
					"metadata": metadata,
					"name": fullname,
					"payment_method": payment_method
				}

				customer = stripe.Customer.create(**params)

				link_Stripe_customers_users = MySQL.execute(
					sql="INSERT INTO Stripe_customers_users (user, Stripe_customer_id) VALUES (%s, %s);",
					params=[
						session["user"]["id"],
						customer.id
					],
					commit=True
				)
				if link_Stripe_customers_users is False:
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
			if Stripe.initialized is not True:
				Log.warning("Payment.get_customer_id_by_user_id(): Stripe_is_not_initialized")
				return False

			data = MySQL.execute(
				sql="SELECT Stripe_customer_id FROM Stripe_customers_users WHERE user = %s LIMIT 1;",
				params=[user_id],
				fetch_one=True
			)
			if data is False: return False
			if data is None: return None

			return data["Stripe_customer_id"]

		@staticmethod
		def find_customer_by_user_id(user_id, limit=100):
			if Stripe.initialized is not True:
				Log.warning("Payment.find_customer_by_user_id(): Stripe_is_not_initialized")
				return False

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
