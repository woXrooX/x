export function short_scale_notation(number){
	if(number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
	if (number >= 1000) return (number / 1000).toFixed(1) + 'k';
	return number.toString();
}



/////////////////////////// format_number

// Formatters by locale + options
const cached_format_number_formatters = new Map();

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
	currency_display = "symbol",
	currency_sign = "standard",

	// scientific, engineering, compact
	notation = "standard",

	// long, short
	compact_display = "short"
}){
	// Convert string to number if needed
	const numeric_value = typeof number === "string" ? parseFloat(number) : number;

	// Check if it's a valid number
	if (isNaN(numeric_value)) return number;

	const options = {
		"style": style,


		"currency": currency,
		"currencyDisplay": currency_display,
		"currencySign": currency_sign,


		"useGrouping": use_grouping,


		"minimumFractionDigits": minimum_fraction_digits,
		"maximumFractionDigits": maximum_fraction_digits,


		"notation": notation,

		// "compactDisplay" only has an effect when notation is "compact"
		"compactDisplay": compact_display,
	};

	const KEY = `${locale}|${JSON.stringify(options)}`;

	let formatter = cached_format_number_formatters.get(KEY);

	if (formatter === undefined) {
		formatter = new Intl.NumberFormat(locale, options);
		cached_format_number_formatters.set(KEY, formatter);
	}

	return formatter.format(numeric_value);
}
