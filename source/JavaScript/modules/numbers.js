export function short_scale_notation(number){
	if(number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
	if (number >= 1000) return (number / 1000).toFixed(1) + 'k';
	return number.toString();
}

export function format_number({
	number,
	locale = undefined,

	// General Purpose Defaults
	style = "decimal",
	use_grouping = true,
	minimum_fraction_digits = 0,
	maximum_fraction_digits = 3,

	// Currency Defaults (only used if style is "currency")
	currency = "USD",
	currency_display = "symbol"
}){
	// Convert string to number if needed
	const numeric_value = typeof number === 'string' ? parseFloat(number) : number;

	// Check if it's a valid number
	if (isNaN(numeric_value)) return number;

	const formatter = new Intl.NumberFormat(locale, {
		style: style,
		currency: currency,
		currencyDisplay: currency_display,
		useGrouping: use_grouping,
		minimumFractionDigits: minimum_fraction_digits,
		maximumFractionDigits: maximum_fraction_digits
	});

	return formatter.format(numeric_value);
}
