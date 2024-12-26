export function feedback_leave_button(){
	if(!("x_feedback_leave" in window.CONF["pages"])) return '';
	if(window.CONF["pages"]["x_feedback_leave"]["enabled"] === false) return '';

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
		<column id="modal_feedback_button" class="text-size-1-5 bg-error radius-default padding-1 position-fixed bottom-20px right-20px width-auto">
			<x-svg name="feedback" color="white"></x-svg>
		</column>
		<x-modal trigger_selector="column#modal_feedback_button">
			<h2>Report a problem</h2>

			<form action="/x/feedback/leave" for="leave_feedback" class="padding-2" x-modal="on:success:hide" x-toast="on:any:message">

				<input type="hidden" name="feedback_left_page" value="${window.location.pathname}">

				${unauthenticated_user_inputs_HTML}

				<label>
					<p for="feedback_text">Description</p>
					<textarea name="feedback_text" rows="5"></textarea>
				</label>

				<label>
					<input class="btn btn-primary" type="submit" name="leaveFeedback" value="Submit">
					<p for="leaveFeedback"></p>
				</label>

			</form>
		</x-modal>
	`;
}
