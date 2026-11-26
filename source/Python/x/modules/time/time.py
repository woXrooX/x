if __name__ != "__main__":
	from datetime import datetime, date
	from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

	from Python.x.modules.Response import Response


	# Returns "datetime" object
	# Validates & formats the timestamp string
	def string_to_datetime(
		timestamp: str,
		format_string = "%Y-%m-%d %H:%M:%S.%f"
	):
		try: return datetime.strptime(timestamp, format_string)
		except: return False



	# Convert a wall-clock value (string or datetime) in timezone (string or ZoneInfo) to an aware UTC datetime.
	# A value that already carries an offset keeps it, and timezone is ignored.
	def timezone_to_UTC(timestamp, timezone):
		if isinstance(timestamp, str): timestamp = datetime.fromisoformat(timestamp)

		if timestamp.tzinfo is None:
			if isinstance(timezone, str): timezone = ZoneInfo(timezone)

			timestamp = timestamp.replace(tzinfo=timezone)

		return timestamp.astimezone(ZoneInfo("UTC"))



	# Return the ZoneInfo for a timezone name, or an error Response.
	# ZoneInfoNotFoundError: unknown name. ValueError: malformed name (empty, "../x", "zone.tab").
	def validate_timezone(timezone):
		if not isinstance(timezone, str): return Response.make(type="error", message="invalid_timezone")

		try: return ZoneInfo(timezone)
		except (ZoneInfoNotFoundError, ValueError): return Response.make(type="error", message="invalid_timezone")
