if __name__ != "__main__":
	from datetime import datetime, date
	from zoneinfo import ZoneInfo

	# Returns "datetime" object
	# Validates & formats the timestamp string
	def string_to_datetime(
		timestamp: str,
		format_string = "%Y-%m-%d %H:%M:%S.%f"
	):
		try: return datetime.strptime(timestamp, format_string)
		except: return False

	# Convert a wall-clock value (string or datetime) in timezone to an aware UTC datetime.
	def timezone_to_UTC(timestamp, timezone):
		if isinstance(timestamp, str): timestamp = datetime.fromisoformat(timestamp)

		if timestamp.tzinfo is None: timestamp = timestamp.replace(tzinfo=ZoneInfo(timezone))

		return timestamp.astimezone(ZoneInfo("UTC"))
