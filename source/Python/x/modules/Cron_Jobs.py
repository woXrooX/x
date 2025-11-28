if __name__ != "__main__":
	import json
	import requests
	from datetime import datetime, date

	from Python.x.modules.Globals import Globals
	from Python.x.modules.MySQL import MySQL
	from Python.x.modules.Logger import Log
	from Python.x.modules.Notifications import Notifications

	class Cron_Jobs():
		######################## Jobs

		@staticmethod
		def job_A():
			#### Event name and id
			this_event_name = "job_event_name"
			if this_event_name not in Globals.NOTIFICATION_EVENTS: return False
			this_event_id = Globals.NOTIFICATION_EVENTS[this_event_name]["id"]

			Cron_Jobs.create_log(this_event_id, data_JSON={"user_id": user_id})




		######################## Heplers

		@staticmethod
		def create_log(event_id, data_JSON = None):
			data = MySQL.execute(
				sql="INSERT INTO cron_job_logs (event, data_JSON) VALUES (%s, %s);",
				params=[
					event_id,
					json.dumps(data_JSON, default=str) if isinstance(data_JSON, dict) else None
				],
				commit=True
			)
			if data is False: return False
			return True

		@staticmethod
		def history_JSON_string_to_dict(history):
			# Converting JSON string to dict
			for i in range(len(history)):
				if history[i]["data_JSON"] is not None: history[i]["data_JSON"] = json.loads(history[i]["data_JSON"])

			return history

		@staticmethod
		def init():
			Log.info("Cron_Jobs.init(): Initializing the jobs")

			Cron_Jobs.job_A()

