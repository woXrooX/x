export function short_scale_notation(number){
	if(number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
	if (number >= 1000) return (number / 1000).toFixed(1) + 'k';
	return number.toString();
}

export function number_to_locale_string({
	number,
	locale = undefined,



	//// Options: Currency related

	style = "currency",
	currency = "USD",
	currency_display = "symbol",
	minimum_fraction_digits = 2,
	maximum_fraction_digits = 2,
	use_grouping = true
}){
	// Convert string to number if needed
	const numeric_value = typeof number === 'string' ? parseFloat(number) : number;

	// Check if it's a valid number
	if (isNaN(numeric_value)) return number;

	return numeric_value.toLocaleString(
		// en-US, en-GB, de-DE...
		// undefined = falls back to system
		locale,
		{
			// currency, decimal, percent
			style: style,

			// USD, GBP, EUR..
			currency: currency,

			// 'symbol', 'code', or 'name'
			currencyDisplay: currency_display,

			minimumFractionDigits: minimum_fraction_digits,
			maximumFractionDigits: maximum_fraction_digits,

			// true = use thousands separators
			useGrouping: use_grouping
		}
	);
}
