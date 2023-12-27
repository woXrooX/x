export function trainingExpiryUIBuilder(certificateCompletionDateArg, trainingValidityDuration, userID, certificateFileName){
	let isUserPassed = `<td style="background-color:var(--color-error)">Missing</td>`;

	if(!!certificateCompletionDateArg === false) return isUserPassed;

	const certificateCompletionDate = new Date(certificateCompletionDateArg);
	const humanReadablePassedTimestamp = (certificateCompletionDate.getMonth()+1) +" "+ certificateCompletionDate.getFullYear();
	const currentTimestamp = new Date();
	const monthsPassedAfterPassingTraining = (currentTimestamp.getYear() - certificateCompletionDate.getYear())*12 + currentTimestamp.getMonth() - certificateCompletionDate.getMonth();

	// Expired
	if(monthsPassedAfterPassingTraining > trainingValidityDuration)
		isUserPassed = `
			<td style="background-color:var(--color-error)">
				<b>Completion date: </b>${humanReadablePassedTimestamp}<br>
				<b>Status: </b>Expired ${monthsPassedAfterPassingTraining-trainingValidityDuration} month(s) ago<br>
				<b>Certificate: </b><a target="_blank" href="/users/${userID}/documents/${certificateFileName}">view</a>
			</td>
		`;

	// Expires This Month
	else if(monthsPassedAfterPassingTraining == trainingValidityDuration)
		isUserPassed = `
			<td style="background-color:var(--color-warning); color:var(--color-text-accent);">
				<b>Completion date: </b>${humanReadablePassedTimestamp}<br>
				<b>Status: </b>Expires this month<br>
				<b>Certificate: </b><a target="_blank" style="color:var(--color-text-accent);" href="/users/${userID}/documents/${certificateFileName}">view</a>
			</td>
		`;

	// Valid X More Months
	else if(monthsPassedAfterPassingTraining < trainingValidityDuration)
		isUserPassed = `
			<td style="background-color:var(--color-success)">
				<b>Completion date: </b>${humanReadablePassedTimestamp}<br>
				<b>Status: </b>Valid for ${trainingValidityDuration - monthsPassedAfterPassingTraining} more month(s)<br>
				<b>Certificate: </b><a target="_blank" href="/users/${userID}/documents/${certificateFileName}">view</a>
			</td>
		`;

	return isUserPassed;
}


export function leaveFeedbackFormUI(){
	return `
		<h2>Report a problem</h2>

		<form action="/feedbacks/leave" for="leaveFeedback" class="p-2" x-modal-action="hide">

			<input type="hidden" name="feedback_left_page" value="${window.location.pathname}">

			<label>
				<p for="name">Please enter your name</p>
				<input type="text" name="name">
			</label>

			<label>
				<p for="eMail">Emial</p>
				<input type="email" name="eMail">
			</label>

			<label>
				<p for="feedback_text">Feedback</p>
				<textarea name="feedback_text" rows="5"></textarea>
			</label>

			<label>
				<input class="btn btn-primary" type="submit" name="leaveFeedback" value="Leave feedback">
				<p for="leaveFeedback"></p>
			</label>

		</form>
	`;
}
