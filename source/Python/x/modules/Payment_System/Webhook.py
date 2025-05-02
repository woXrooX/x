if __name__ != "__main__":
	class Webhook:
		@staticmethod
		def payment_intent_create(payment_intent, last_event, last_event_status):
			return True

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
