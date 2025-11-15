if __name__ != "__main__":
	import requests
	from datetime import datetime

	from Python.x.modules.Logger import Log

	def send_message_to_group_topic(
		type,
		message_short,
		message_long,
		TOKEN,
		GROUP_ID,
		TOPIC_ID
	):
		try:

			payload = {
				"chat_id": GROUP_ID,
				"message_thread_id": TOPIC_ID,
				"text": f"""
{datetime.now().strftime('%Y.%m.%d %H:%M:%S')}
{type} - {message_short}

{message_long}
				""",
				"parse_mode": "Markdown"
			}

			resp = requests.post(
				f"https://api.telegram.org/bot{TOKEN}/sendMessage",
				json=payload,
				timeout=5
			)

			resp.raise_for_status()

		except Exception as e: Log.error(f"Telegram.send_message_to_group_topic(): {e}")


