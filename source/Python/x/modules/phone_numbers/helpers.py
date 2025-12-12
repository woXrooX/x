if __name__ != "__main__":
	import re

	def local_to_international(phone_number, country_code):
		cleaned_number = cleaner(phone_number)

		# Check if the number starts with "+" (Already international)
		if cleaned_number.startswith("+"): return cleaned_number

		# Check if the number starts with the country code
		if cleaned_number.startswith(str(country_code)): return f"+{cleaned_number}"

		# For UK numbers (country code 44), remove the leading 0 if present
		if country_code == "44" and cleaned_number.startswith("0"): cleaned_number = cleaned_number[1:]

		# Add the country code and format the number
		return f"+{country_code}{cleaned_number}"


	def cleaner(phone_number):
		# Remove any non-digit characters from the phone number
		return ''.join(filter(str.isdigit, phone_number))


	def format_UK_phone_number(raw_phone_number):
		if not raw_phone_number: return None

		formatted_phone_number = None

		# Remove spaces first
		formatted_phone_number = re.sub(r'\s+', '', raw_phone_number)

		# Match UK number patterns (both +44 and 0 formats)
		match = re.match(r'^(?:\+44(\d{9,10})|0(\d{9,10}))$', formatted_phone_number)

		if match:
			# Get the significant digits from whichever group matched
			significant_digits = match.group(1) if match.group(1) else match.group(2)

			# Format as E.164
			formatted_phone_number = f"+44{significant_digits}"

		else: return None

		return formatted_phone_number
