if __name__ != "__main__":
	from python.modules.Globals import Globals
	from python.modules.Logger import Log

	class Twilio():
		enabled = False
		client = None

		@staticmethod
		def init():
			if Globals.CONF.get("Twilio", {}).get("enabled", False) is not True: return

			from twilio.rest import Client

			try:
				Twilio.client = Client(
					api_key = Globals.CONF["Twilio"]["api_key"],
					api_secret = Globals.CONF["Twilio"]["api_secret"],
					account_sid = Globals.CONF["Twilio"]["account_sid"],
					auth_token = Globals.CONF["Twilio"]["auth_token"],
					region = Globals.CONF["Twilio"]["region"],
					edge = Globals.CONF["Twilio"]["edge"]
				)
				Twilio.enabled = True
				Log.success(f"Twilio.init()")

			except Exception as e: Log.error(f"Twilio.init(): {e}")

		@staticmethod
		def send_sms(to_phone, from_phone, body):
			if Twilio.enabled is not True: return False

			try:
				message = Twilio.client.messages.create(to_phone, from_phone, body)
				Log.success(f"Twilio.send_sms(): {message.sid}")
				return True

			except TwilioRestException as e:
				Log.error(f"Twilio.send_sms(): {e}")
				return False

			except Exception as e:
				Log.error(f"Twilio.send_sms(): {e}")
				return False
