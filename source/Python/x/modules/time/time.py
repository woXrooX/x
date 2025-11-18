if __name__ != "__main__":
	from datetime import datetime, date

	# Returns "datetime" object
	def validate_timestamp(
		timestamp: str,
		format_string = "%Y-%m-%d %H:%M:%S.%f"
	):
		validated_time = False

		try: validated_time = datetime.strptime(timestamp, format_string).date()
		except: return False

		return validated_time
