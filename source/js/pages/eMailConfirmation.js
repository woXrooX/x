"use strict";

export const TITLE = window.Lang.use(["eMailConfirmation"]);

export default function content(){
	return `
	<container class="p-5">
		<column class="w-50 surface-clean p-5 gap-1">

			<p class="text-center">${window.Lang.use("eMailConfirmationCodeHasBeenSent")}</p>

			<form action="eMailConfirmation" for="eMailConfirmation">


				<label>
					<p for='verificationCode'></p>
					<input type='number' name='verificationCode'>
				</label>

				<label>
					<input class="btn btn-primary" type='submit' name='verify' value='${window.Lang.use("verifyEmail")}'>
					<p for='eMailConfirmation'></p>
				</label>

			</form>

			<p class="text-center text-size-0-7">
				<warning>Warning:</warning>
				Kindly ensure to review your spam folders too.
			</p>

		</column>
	</container>
	`;
}
