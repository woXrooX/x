if __name__ != "__main__":
	from twilio.rest import Client
	from twilio.base.exceptions import TwilioRestException

	from python.modules.Globals import Globals
	from python.modules.Logger import Log

	class Twilio():
		enabled = False
		client = None

		@staticmethod
		def init():
			if Globals.CONF.get("Twilio", {}).get("enabled", False) is not True: return

			try:
				Twilio.client = Client(Globals.CONF["Twilio"]["account_sid"], Globals.CONF["Twilio"]["auth_token"])
				Twilio.enabled = True
				Log.success(f"Twilio.init()")

			except Exception as e: Log.error(f"Twilio.init(): {e}")

		@staticmethod
		def send_sms(body, from_phone, to_phone):
			if Twilio.enabled is not True: return False

			try:
				message = Twilio.client.messages.create(body=body, from_=from_phone, to=to_phone)
				Log.success(f"Twilio.send_sms(): {message.sid}")
				return True

			except TwilioRestException as e:
				Log.error(f"Twilio.send_sms(): {e}")
				return False

			except Exception as e:
				Log.error(f"Twilio.send_sms(): {e}")
				return False
