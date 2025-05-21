if __name__ != "__main__":
	from Python.x.modules.Globals import Globals
	from Python.x.modules.Logger import Log

	class Twilio():
		initialized = False
		client = None

		@staticmethod
		def init():
			if Globals.CONF.get("Twilio", {}).get("enabled", False) is not True: return

			from twilio.rest import Client

			try:
				Twilio.client = Client(Globals.CONF["Twilio"]["account_sid"], Globals.CONF["Twilio"]["auth_token"])
				Twilio.initialized = True
				Log.success(f"Twilio.init()")

			except Exception as e: Log.error(f"Twilio.init(): {e}")

		@staticmethod
		def send_sms(body, from_phone, to_phone):
			if Twilio.initialized is not True: return False

			try:
				message = Twilio.client.messages.create(body=body, from_=from_phone, to=to_phone)
				Log.success(f"Twilio.send_sms(): {message.sid}")
				return True

			except Exception as e:
				Log.error(f"Twilio.send_sms(): {e}")
				return False
