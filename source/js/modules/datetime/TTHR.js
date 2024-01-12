// Timestamp to human readable
export default function TTHR(inputTimestamp){
	const timestamp = new Date(inputTimestamp);
	const now = new Date();

	// Calculate the total difference in milliseconds
	const totalDiff = now - timestamp;

	// Calculate total differences in days, weeks, hours, minutes, and seconds
	const totalDaysDiff = Math.round(totalDiff / (1000 * 60 * 60 * 24));
	const totalWeeksDiff = Math.round(totalDaysDiff / 7);
	const totalHoursDiff = Math.round(totalDiff / (1000 * 60 * 60));
	const totalMinutesDiff = Math.round(totalDiff / (1000 * 60));
	const totalSecondsDiff = Math.round(totalDiff / 1000);

	// Year difference
	const yearDiff = now.getFullYear() - timestamp.getFullYear();
	if(totalDaysDiff >= 365 || totalDaysDiff <= -365){
		return yearDiff > 0
			? `${yearDiff} year${yearDiff > 1 ? 's' : ''} ago`
			: `After ${-yearDiff} year${-yearDiff > 1 ? 's' : ''}`;
	}

	// Month difference
	const monthDiff = (now.getFullYear() - timestamp.getFullYear()) * 12 + now.getMonth() - timestamp.getMonth();
	if(totalDaysDiff >= 30 || totalDaysDiff <= -30){
		return monthDiff > 0
			? `${monthDiff} month${monthDiff > 1 ? 's' : ''} ago`
			: `After ${-monthDiff} month${-monthDiff > 1 ? 's' : ''}`;
	}

	// Week difference
	if(totalWeeksDiff !== 0){
		return totalWeeksDiff > 0
			? `${totalWeeksDiff} week${totalWeeksDiff > 1 ? 's' : ''} ago`
			: `After ${-totalWeeksDiff} week${-totalWeeksDiff > 1 ? 's' : ''}`;
	}

	// Day difference
	if(totalDaysDiff !== 0){
		return totalDaysDiff > 0
			? `${totalDaysDiff} day${totalDaysDiff > 1 ? 's' : ''} ago`
			: `After ${-totalDaysDiff} day${-totalDaysDiff > 1 ? 's' : ''}`;
	}

	// Hour difference
	if(totalHoursDiff !== 0){
		return totalHoursDiff > 0
			? `${totalHoursDiff} hour${totalHoursDiff > 1 ? 's' : ''} ago`
			: `After ${-totalHoursDiff} hour${-totalHoursDiff > 1 ? 's' : ''}`;
	}

	// Minute difference
	if(totalMinutesDiff !== 0){
		return totalMinutesDiff > 0
			? `${totalMinutesDiff} minute${totalMinutesDiff > 1 ? 's' : ''} ago`
			: `After ${-totalMinutesDiff} minute${-totalMinutesDiff > 1 ? 's' : ''}`;
	}

	// Second difference
	return totalSecondsDiff > 0
		? `${totalSecondsDiff} second${totalSecondsDiff > 1 ? 's' : ''} ago`
		: `After ${-totalSecondsDiff} second${-totalSecondsDiff > 1 ? 's' : ''}`;
}
