"use strict";

export const TITLE = "Add positive feedback";

export default function content(){
	return `
		<container class="py-5">
			<column class="w-70 p-5 surface-clean">

				<h1>Add positive feedback</h1>

				<form action="/competencyPortfolio/addPositiveFeedback" for="addPositiveFeedback">

					<label>
						<p for='title'>Title of feedback</p>
						<input type='text' name='title'>
					</label>

					<label>
						<p for='date'>Date of feedback</p>
						<input type='date' name='date'>
					</label>

					<label>
						<p for='from'>Who the feedback is from</p>
						<input type='text' name='from'>
					</label>

					<label>
						<p for='feedback'>Feedback details</p>
						<textarea name="feedback" rows="5"></textarea>
					</label>

					<label>
						<p for='file'>Attachment</p>
						<input type='file' name='file'>
					</label>

					<label>
						<input class="btn btn-primary" type='submit' name='addPositiveFeedback' value='Save'>
						<p for='addPositiveFeedback'></p>
					</label>

				</form>

			</column>
		</container>
	`;
}
