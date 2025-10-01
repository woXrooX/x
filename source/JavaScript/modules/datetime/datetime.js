// Timestamp to human readable
// Exptected input: type->string, fromat "2034-11-18 01:29:44"
export function timestamp_to_human_readable_v1(input_timestamp){
	const UTC_timestamp = timestamp_to_UTC(input_timestamp);
	const local_timestamp = UTC_to_local_timestamp(UTC_timestamp);

	const timestamp = new Date(local_timestamp);
	if(isNaN(timestamp)) return false;

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

export function timestamp_to_human_readable_v2(input_timestamp) {
	const UTC_timestamp = timestamp_to_UTC(input_timestamp);
	const local_timestamp = UTC_to_local_timestamp(UTC_timestamp);

	const timestamp = new Date(local_timestamp);
	if(isNaN(timestamp)) return false;

	const now = new Date();
	const total_diff = now - timestamp;
	const abs_total_diff = Math.abs(total_diff);

	const units = [
		{ value: 365 * 24 * 60 * 60 * 1000, label: 'y' },
		{ value: 30 * 24 * 60 * 60 * 1000, label: 'mo' },
		{ value: 7 * 24 * 60 * 60 * 1000, label: 'w' },
		{ value: 24 * 60 * 60 * 1000, label: 'd' },
		{ value: 60 * 60 * 1000, label: 'h' },
		{ value: 60 * 1000, label: 'm' },
		{ value: 1000, label: 's' }
	];

	for(let unit of units)
		if(abs_total_diff >= unit.value) return `${Math.floor(abs_total_diff / unit.value)}${unit.label}`;

	return 'now';
}

export const timestamp_to_UTC = (timestamp) => timestamp.replace(' ', 'T') + 'Z';

export function UTC_to_local_timestamp(UTC_timestamp) {
	const date = new Date(UTC_timestamp);

	const user_time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const local_timestamp = new Intl.DateTimeFormat("en-US", {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
		timeZone: user_time_zone
	}).format(date);

	const [month, day, year, time] = local_timestamp.split(/[/,]/);
	const [hours, minutes, seconds] = time.trim().split(':');

	return `${year}-${month}-${day.trim()} ${hours}:${minutes}:${seconds}`;
}

export function server_timestamp_to_local_timestamp(server_timestamp){
	const UTC_timestamp = timestamp_to_UTC(timestamp_to_UTC);
	const local_timestamp = UTC_to_local_timestamp(UTC_timestamp);
	return local_timestamp;
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

// time = HH:mm:ss.fraction
export function time_to_milliseconds(time) {
	if (typeof time !== "string") return false;

	const matches = time.match(/^\s*(\d+):([0-5]\d):([0-5]\d)(?:\.(\d+))?\s*$/);
	if (!matches) return false;

	const hours = parseInt(matches[1], 10);
	const minutes = parseInt(matches[2], 10);
	const seconds = parseInt(matches[3], 10);
	const fraction = matches[4] || '';

	// Convert fractional seconds to milliseconds (truncate beyond 3 digits)
	let ms = 0;
	if (fraction.length > 0) {

		ms = fraction.length <= 3 ?
			// e.g. .5 -> 500, .12 -> 120
			Number(fraction.padEnd(3, "0")) :

			// e.g. .123456 -> 123 ms (truncated)
			Number(fraction.slice(0, 3));
	}

	return ((hours * 60 + minutes) * 60 + seconds) * 1000 + ms;
}

// Converts a duration in milliseconds to "HH:mm:ss[.fraction]"
export function milliseconds_to_time(milliseconds) {
	const milliseconds_number = Number(milliseconds);
	if (!Number.isFinite(milliseconds_number)) return false;

	const sign = milliseconds_number < 0 ? '-' : '';

	// Drop sub-ms if present
	let ms = Math.abs(Math.trunc(milliseconds_number));

	const hours = Math.floor(ms / 3_600_000); ms -= hours * 3_600_000;
	const minutes = Math.floor(ms / 60_000); ms -= minutes * 60_000;
	const seconds = Math.floor(ms / 1_000); ms -= seconds * 1_000;

	const hh = String(hours).padStart(2, '0');
	const mm = String(minutes).padStart(2, '0');
	const ss = String(seconds).padStart(2, '0');

	// If there's no fractional part, omit it entirely
	if (ms === 0) return `${sign}${hh}:${mm}:${ss}`;

	// Otherwise show trimmed fractional seconds (1–3 digits)
	const fraction = String(ms).padStart(3, '0').replace(/0+$/, '');
	return `${sign}${hh}:${mm}:${ss}.${fraction}`;
}



// Exptected input: type->string, format->HH:mm:ss
export function parse_time(time){
	if(typeof time !== "string") return false;
	if(/^([0-9]|[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(time) === false) return false;

	const splitted = time.split(':');

	return {
		hour: splitted[0].padStart(2, '0'),
		minute: splitted[1].padStart(2, '0'),
		second: splitted[2].padStart(2, '0')
	}
}

// Output: 13h 24m 13s
export function milliseconds_to_human_readable_v1(milliseconds) {
	let seconds = Math.floor(milliseconds / 1000);

	const hours = Math.floor(seconds / 3600);
	seconds %= 3600;

	const minutes = Math.floor(seconds / 60);
	seconds %= 60;

	let formatted_time = '';

	if (hours > 0) formatted_time += `${hours}h `;

	if (minutes > 0 || hours > 0) formatted_time += `${minutes}m `;

	formatted_time += `${seconds}s`;

	return formatted_time;
}

// Format DD.MM.YYYY HH:MM:MS
function milliseconds_to_human_readable_v2(MS){
	const date = new Date(MS);

	const day = date.getDate().toString().padStart(2,'0');
	const month = (date.getMonth() + 1).toString().padStart(2,'0');
	const year = date.getFullYear();
	const hours = date.getHours().toString().padStart(2,'0');
	const minutes = date.getMinutes().toString().padStart(2,'0');
	const milliseconds = date.getMilliseconds().toString().padStart(4,'0');

	return `${day}.${month}.${year} ${hours}:${minutes}:${milliseconds}`;
}
