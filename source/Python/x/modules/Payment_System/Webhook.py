if __name__ != "__main__":
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log

	import stripe

	class Webhook:
		@staticmethod
		def handle(
			payload,
			signature
		):
			try:
				event = stripe.Webhook.construct_event(
					payload=payload,
					sig_header=signature,
					secret=Globals.CONF["Stripe"]["webhook_secret"]
				)

				data = event["data"]

			except ValueError:
				Log.error("Webhook: Error while decoding event!")
				return "Bad payload", 400

			except stripe.error.SignatureVerificationError:
				Log.error("Webhook: Invalid signature!")
				return "Bad signature", 400

			except Exception as e:
				Log.error(f"Webhook: {e}")
				return "Error", 400

			obj = event["data"]["object"]

			# Log.line('>')
			# Log.raw(f"Event type: {event['type']}\nEvent ID: {event.id}\nObject ID: {obj.id}\nObject status: {obj.status}")
			# Log.line('|')
			# print(event)
			# Log.line('<')

			if event["type"] == "payment_intent.canceled":
				if Webhook.payment_intent_canceled(obj.id, event["type"], obj.status) is False:
					Log.error("Webhook: payment_intent.canceled -> database_error")

			if event["type"] == "charge.failed":
				if Webhook.charge_failed(obj.payment_intent, event["type"], obj.status) is False:
					Log.error("Webhook: charge.failed -> database_error")

			if event["type"] == "payment_intent.payment_failed":
				if Webhook.payment_intent_payment_failed(obj.id, event["type"], obj.status) is False:
					Log.error("Webhook: payment_intent.payment_failed -> database_error")

			if event["type"] == "payment_intent.succeeded":
				if Webhook.payment_intent_succeeded(obj.id, event["type"], obj.status) is False:
					Log.error("Webhook: payment_intent.succeeded -> database_error")

			if event["type"] == "charge.succeeded":
				if Webhook.charge_succeeded(obj.payment_intent, event["type"], obj.status, obj.amount) is False:
					Log.error("Webhook: charge.succeeded -> database_error")

			return "OK", 200


		@staticmethod
		def payment_intent_canceled(payment_intent, last_event, last_event_status):
			return True

		@staticmethod
		def charge_failed(payment_intent, last_event, last_event_status):
			return True

		@staticmethod
		def payment_intent_payment_failed(payment_intent, last_event, last_event_status):
			return True

		@staticmethod
		def payment_intent_succeeded(payment_intent, last_event, last_event_status):
			return True

		@staticmethod
		def charge_succeeded(payment_intent, last_event, last_event_status, charge_amount):
			return True
