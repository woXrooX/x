if __name__ != "__main__":
	import json
	import stripe

	from Python.x.modules.Globals import Globals
	from Python.x.modules.MySQL import MySQL
	from Python.x.modules.Logger import Log

	class Webhook():

		###################### API

		@staticmethod
		def handle_event(
			payload,
			signature
		):
			try:
				event = stripe.Webhook.construct_event(
					payload=payload,
					sig_header=signature,
					secret=Globals.CONF["Stripe"]["webhook_secret"]
				)

			except ValueError:
				Log.error("Webhook.handle_event(): Error while decoding event!")
				return "Bad payload", 400

			except stripe.error.SignatureVerificationError:
				Log.error("Webhook.handle_event(): Invalid signature!")
				return "Bad signature", 400

			except Exception as e:
				Log.error(f"Webhook.handle(): {e}")
				return "Error", 400

			log_to_DB_result = Webhook.log_to_DB(event)
			if log_to_DB_result is False:
				# I will think what to do later
				pass

			obj = event["data"]["object"]

			Log.line('>')
			Log.raw(f"Event type: {event['type']}\nEvent ID: {event.id}\nObject ID: {obj.id}\nObject status: {obj.status}")
			Log.line('|')
			print(event)
			Log.line('<')

			match event["type"]:
				case "payment_intent.canceled": Webhook.payment_intent_canceled(obj, event["type"])
				case "payment_intent.payment_failed": Webhook.payment_intent_payment_failed(obj, event["type"])
				case "payment_intent.created": Webhook.payment_intent_created(obj, event["type"])
				case "payment_intent.succeeded": Webhook.payment_intent_succeeded(obj, event["type"])

				case "charge.failed": Webhook.charge_failed(obj, event["type"])
				case "charge.succeeded": Webhook.charge_succeeded(obj, event["type"])

				case "customer.subscription.created": Webhook.subscription_created(obj, event["type"])
				case "customer.subscription.updated": Webhook.subscription_updated(obj, event["type"])
				case "customer.subscription.deleted": Webhook.subscription_deleted(obj, event["type"])

				case "invoice.payment_succeeded": Webhook.invoice_payment_succeeded(obj, event["type"])
				case "invoice.payment_failed": Webhook.invoice_payment_failed(obj, event["type"])

				case _: Log.warning(f"Webhook.handle_event(): Unhandled event type -> {event['type']}")

			return "OK", 200




		###################### Helpers

		@staticmethod
		def log_to_DB(event):
			try:
				# Extract event data
				event_id = event.get("id")
				event_type_name = event.get("type")
				API_version = event.get("api_version")

				# Stripe returns it as a boolean
				livemode = event.get("livemode", False)
				created = event.get("created")

				# Extract object data
				obj = event["data"]["object"]
				object_id = obj.get("id")
				object_type_name = obj.get("object")
				object_status = obj.get("status")
				customer_id = obj.get("customer")


				# Handle amount - could be in different fields depending on object type
				amount = None
				if "amount" in obj: amount = obj["amount"]
				elif "amount_total" in obj: amount = obj["amount_total"]
				elif "amount_paid" in obj: amount = obj["amount_paid"]


				# (Later) Validate the currency against table: currencies
				currency = obj.get("currency")

				# (Later) Validate agains tables:
				# Stripe_event_types
				# Stripe_object_types
				event_type_id = None
				object_type_id = None

				insert = MySQL.execute(
					sql="""
						INSERT INTO Stripe_webhook_logs
						(
							event_id,
							event_type,
							event_data,
							API_version,
							livemode,

							object_id,
							object_type,
							object_status,
							customer_id,
							amount,
							currency,
							created
						)
						VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, FROM_UNIXTIME(%s))
					""",
					params=[
						event_id,
						event_type_id,
						json.dumps(event),
						API_version,
						1 if livemode else 0,

						object_id,
						object_type_id,
						object_status,
						customer_id,
						amount,
						currency,
						created
					],
					commit=True
				)
				if insert is False:
					Log.error("Webhook.log_to_DB(): database_error")
					return False

			except Exception as e:
				Log.error(f"Webhook.log_to_DB(): {e}")
				return False

			return True


		########### Event handlers

		@staticmethod
		def payment_intent_canceled(obj, event_type):
			Log.warning("Webhook.payment_intent_canceled()")

			# Handle payment intent canceled
			# Update your database or trigger relevant actions
			return True

		@staticmethod
		def payment_intent_payment_failed(obj, event_type):
			Log.warning("Webhook.payment_intent_payment_failed()")

			# Handle payment intent failed
			return True

		@staticmethod
		def payment_intent_created(obj, event_type):
			Log.warning("Webhook.payment_intent_created()")
			return True

		@staticmethod
		def payment_intent_succeeded(obj, event_type):
			Log.warning("Webhook.payment_intent_succeeded()")

			# Handle payment intent succeeded
			return True


		@staticmethod
		def charge_failed(obj, event_type):
			Log.warning("Webhook.charge_failed()")

			payment_intent = obj.payment_intent
			status = obj.status
			# Handle charge failed
			return True

		@staticmethod
		def charge_succeeded(obj, event_type):
			Log.warning("Webhook.charge_succeeded()")

			payment_intent = obj.payment_intent
			status = obj.status
			charge_amount = obj.amount
			# Handle charge succeeded
			return True


		# Subscription event handlers
		@staticmethod
		def subscription_created(obj, event_type):
			Log.warning("Webhook.subscription_created()")

			# Handle subscription created
			# Store subscription details in your database
			subscription_id = obj.id
			customer_id = obj.customer
			status = obj.status
			current_period_end = obj.current_period_end
			# You can access subscription items with obj.items.data
			# Store these details in your database
			return True

		@staticmethod
		def subscription_updated(obj, event_type):
			Log.warning("Webhook.subscription_updated()")

			# Handle subscription updated
			subscription_id = obj.id
			status = obj.status
			current_period_end = obj.current_period_end
			# Update subscription details in your database
			return True

		@staticmethod
		def subscription_deleted(obj, event_type):
			Log.warning("Webhook.subscription_deleted()")

			# Handle subscription deleted/canceled
			subscription_id = obj.id
			# Mark subscription as canceled in your database
			return True


		@staticmethod
		def invoice_payment_succeeded(obj, event_type):
			Log.warning("Webhook.invoice_payment_succeeded()")

			# Handle invoice payment succeeded (for subscriptions)
			subscription_id = obj.subscription
			customer_id = obj.customer
			amount_paid = obj.amount_paid
			# Update subscription payment status in your database
			return True

		@staticmethod
		def invoice_payment_failed(obj, event_type):
			Log.warning("Webhook.invoice_payment_failed()")

			# Handle invoice payment failed (for subscriptions)
			subscription_id = obj.subscription
			customer_id = obj.customer
			# Update subscription payment status in your database
			# You might want to notify the customer
			return True
