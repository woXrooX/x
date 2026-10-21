if __name__ != "__main__":
	import re
	from decimal import Decimal

	decimal_pattern = re.compile(r"-?[0-9]+(?:\.([0-9]+))?")

	def string_to_decimal(value, maximum_fraction_digits=None):
		if not isinstance(value, str): return False


		match = decimal_pattern.fullmatch(value)

		if match is None: return False


		if (
			maximum_fraction_digits is not None and
			len(match.group(1) or '') > maximum_fraction_digits
		): return False


		return Decimal(value)
