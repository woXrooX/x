export function feedback_leave_button(){
	if(!("x_feedbacks_leave" in window.CONF["pages"])) return '';
	if(window.CONF["pages"]["x_feedbacks_leave"]["enabled"] === false) return '';

	let unauthenticated_user_inputs_HTML = '';
	if(!("user" in window.session)) unauthenticated_user_inputs_HTML = `
		<label>
			<p for="fullname">Please enter your name</p>
			<input type="text" name="fullname">
		</label>

		<label>
			<p for="eMail">Email</p>
			<input type="email" name="eMail">
		</label>
	`;

	return `
		<column id="modal_feedback_button" class="text-size-1-5 bg-error radius-default p-1 position-fixed bottom-20px right-20px">
			<x-svg name="feedback" color="white"></x-svg>
		</column>
		<x-modal trigger_selector="column#modal_feedback_button">
			<h2>Report a problem</h2>

			<form action="/x/feedbacks/leave" for="leave_feedback" class="p-2" x-modal="on:success:hide" x-toast="on:any:message">

				<input type="hidden" name="feedback_left_page" value="${window.location.pathname}">

				${unauthenticated_user_inputs_HTML}

				<label>
					<p for="feedback_text">Description</p>
					<textarea name="feedback_text" rows="5" class="text-color-primary"></textarea>
				</label>

				<label>
					<input class="btn btn-primary" type="submit" name="leaveFeedback" value="Submit">
					<p for="leaveFeedback"></p>
				</label>

			</form>
		</x-modal>
	`;
}
