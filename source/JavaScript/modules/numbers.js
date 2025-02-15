export function short_scale_notation(number){
	if(number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
	if (number >= 1000) return (number / 1000).toFixed(1) + 'k';
	return number.toString();
}

export function number_to_locale_string(
	number,
	locale,
	style,
	currency,
	minimum_fraction_digits = 2,
	maximum_fraction_digits = 2,
	currency_display = "symbol",
	use_grouping = true
){
	// Convert string to number if needed
	const numeric_value = typeof number === 'string' ? parseFloat(number) : number;

	// Check if it's a valid number
	if (isNaN(numeric_value)) return number;

	const formatted = numeric_value.toLocaleString(
		// en-US, en-GB, de-DE...
		locale,
		{
			// currency, decimal, percent
			style: style,

			// USD, GBP, EUR..
			currency: currency,
			minimumFractionDigits: minimum_fraction_digits,
			maximumFractionDigits: maximum_fraction_digits,

			// 'symbol', 'code', or 'name'
			currencyDisplay: currency_display,

			// true = use thousands separators
			useGrouping: use_grouping
		}
	);

	return formatted;
}
