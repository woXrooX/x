if __name__ != "__main__":
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

