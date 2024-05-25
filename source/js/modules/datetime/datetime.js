// Timestamp to human readable
// Exptected input: type->string, fromat "2034-11-18 01:29:44"
export function TTHR(inputTimestamp){
	const timestamp = new Date(inputTimestamp);
	if (isNaN(timestamp)) return false;

	const now = new Date();
	const total_diff = now - timestamp;

	const abs_total_diff = Math.abs(total_diff);
	const total_days_diff = Math.floor(abs_total_diff / (1000 * 60 * 60 * 24));
	const total_weeks_diff = Math.floor(total_days_diff / 7);
	const total_hours_diff = Math.floor(abs_total_diff / (1000 * 60 * 60));
	const total_minutes_diff = Math.floor(abs_total_diff / (1000 * 60));
	const total_seconds_diff = Math.floor(abs_total_diff / 1000);

	const year_diff = now.getFullYear() - timestamp.getFullYear();
	const month_diff = (now.getFullYear() - timestamp.getFullYear()) * 12 + now.getMonth() - timestamp.getMonth();

	const format_difference = (value, unit) => {
		if (value === 0) return `Just now`;
		const suffix = total_diff > 0 ? 'ago' : 'from now';
		const plural = Math.abs(value) !== 1 ? 's' : '';
		return `${Math.abs(value)} ${unit}${plural} ${suffix}`;
	};

	if(Math.abs(total_days_diff) >= 365) return format_difference(year_diff, 'year');

	if(Math.abs(total_days_diff) >= 30) return format_difference(month_diff, 'month');

	if(Math.abs(total_weeks_diff) !== 0) return format_difference(total_weeks_diff, 'week');

	if(Math.abs(total_days_diff) !== 0) return format_difference(total_days_diff, 'day');

	if(Math.abs(total_hours_diff) !== 0) return format_difference(total_hours_diff, 'hour');

	if(Math.abs(total_minutes_diff) !== 0) return format_difference(total_minutes_diff, 'minute');

	return format_difference(total_seconds_diff, 'second');
}

// Exptected inputs: type->string, fromat->HH:mm:ss
export function time_difference(time_1, time_2){
	const time_1_parsed = parse_time(time_1);
	const time_2_parsed = parse_time(time_2);

	if(time_1_parsed === false || time_2_parsed === false) return false;

	const date_1 = new Date(1970, 0, 1, time_1_parsed["hour"], time_1_parsed["minute"], time_1_parsed["second"]);
	const date_2 = new Date(1970, 0, 1, time_2_parsed["hour"], time_2_parsed["minute"], time_2_parsed["second"]);

	// Calculate the difference in milliseconds
	let diff = Math.abs(date_2 - date_1);

	// Convert back to hours, minutes, and seconds
	const hours = Math.floor(diff / 3600000);
	diff -= hours * 3600000;
	const minutes = Math.floor(diff / 60000);
	diff -= minutes * 60000;
	const seconds = Math.floor(diff / 1000);

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Exptected input: type->string, format->HH:mm:ss
export function parse_time(time){
	if(typeof time !== "string") return false;
	if(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(time) === false) return false;

	const splitted = time.split(':');

	return {
		hour: splitted[0].padStart(2, '0'),
		minute: splitted[1].padStart(2, '0'),
		second: splitted[2].padStart(2, '0')
	}
}
