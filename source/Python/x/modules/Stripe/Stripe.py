if __name__ != "__main__":
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log
	from Python.x.modules.MySQL import MySQL

	class Stripe:
		initialized = False

		@staticmethod
		def init():
			if Globals.CONF.get("Stripe", {}).get("enabled", False) is not True: return

			try:
				import stripe
				stripe.api_key = Globals.CONF["Stripe"]["secret_key"]

				Stripe.initialized = True
				Log.success(f"Stripe.init()")

			except Exception as e: Log.error(f"Stripe.init(): {e}")

			if Stripe.initialized is not True: return

			Stripe.get_Stripe_event_types()
			Stripe.get_Stripe_object_types()


		@staticmethod
		def get_Stripe_event_types():
			data = MySQL.execute("SELECT * FROM Stripe_event_types;")
			if data is False: return Log.fieldset("Could not fetch 'Stripe_event_types'", "MySQL.get_Stripe_event_types()", "error")
			for Stripe_event_type in data: Globals.STRIPE_EVENT_TYPES[Stripe_event_type["name"]] = Stripe_event_type

		@staticmethod
		def get_Stripe_object_types():
			data = MySQL.execute("SELECT * FROM Stripe_object_types;")
			if data is False: return Log.fieldset("Could not fetch 'Stripe_object_types'", "MySQL.get_Stripe_object_types()", "error")
			for Stripe_object_type in data: Globals.STRIPE_OBJECT_TYPES[Stripe_object_type["name"]] = Stripe_object_type

