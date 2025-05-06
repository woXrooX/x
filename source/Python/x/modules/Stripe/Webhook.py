# Register event handlers
# from Python.x.modules.Stripe.Webhook import Webhook

# @Webhook.register_event_handler("charge.succeeded")
# def on_charge_succeeded(event):
# 	print("Custom logic for: charge.succeeded")

if __name__ != "__main__":
	import json

	from Python.x.modules.Globals import Globals
	from Python.x.modules.MySQL import MySQL
	from Python.x.modules.Logger import Log
	from Python.x.modules.Stripe.Stripe import Stripe

	import stripe

	class Webhook():
		###################### Variables

		event_handlers = {}

		###################### API

		@classmethod
		def register_event_handler(cls, event_type):
			def decorator(fn):
				cls.execute_handler_on_event[event_type] = staticmethod(fn)
				return fn
			return decorator

		@staticmethod
		def handle_event(
			payload,
			signature
		):
			if Stripe.initialized is not True: return "Stripe_is_not_initialized", 401

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

			# Log.line('>')
			# Log.raw(f"Event type: {event['type']}\nEvent ID: {event.id}\nObject ID: {event["data"]["object"]["id"]}\nObject status: {event["data"]["object"]["status"]}")
			# Log.line('|')
			# print(event)
			# Log.line('<')

			Webhook.execute_event_handler(event)

			return "OK", 200


		###################### Helpers

		@staticmethod
		def log_to_DB(event):
			try:
				# Extract event data
				event_id = event.get("id")
				event_type_name = event.get("type")

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

				currency = obj.get("currency")
				if currency:
					currency = currency.upper()

					if currency in Globals.CURRENCIES: currency = Globals.CURRENCIES[currency]["id"]
					else:
						Log.error("Webhook.log_to_DB(): not_supported_currency")
						return False

				event_type_id = None
				if event_type_name in Globals.STRIPE_EVENT_TYPES: event_type_id = Globals.STRIPE_EVENT_TYPES[event_type_name]["id"]

				object_type_id = None
				if object_type_name in Globals.STRIPE_OBJECT_TYPES: object_type_id = Globals.STRIPE_OBJECT_TYPES[object_type_name]["id"]

				insert = MySQL.execute(
					sql="""
						INSERT INTO Stripe_webhook_logs
						(
							event_id,
							event_type,
							event_data,
							livemode,
							created,

							object_id,
							object_type,
							object_status,
							customer_id,
							amount,
							currency
						)
						VALUES (%s, %s, %s, %s, FROM_UNIXTIME(%s), %s, %s, %s, %s, %s, %s)
					""",
					params=[
						event_id,
						event_type_id,
						json.dumps(event),
						1 if livemode else 0,
						created,

						object_id,
						object_type_id,
						object_status,
						customer_id,
						amount,
						currency
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
		def execute_handler_on_event(event):
			event_type = event["type"]
			handler = Webhook.event_handlers.get(event_type, Webhook.default_handler)
			return handler(event)

		@staticmethod
		def default_handler(event):
			Log.info(f"No handler for event: {event['type']}")

