if __name__ != "__main__":
	from datetime import datetime, date

	# Returns "datetime" object
	# Validates & formats the timestamp string
	def string_to_datetime(
		timestamp: str,
		format_string = "%Y-%m-%d %H:%M:%S.%f"
	):
		try: return datetime.strptime(timestamp, format_string)
		except: return False
