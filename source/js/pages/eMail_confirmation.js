"use strict";

export const TITLE = window.Lang.use(["eMail_confirmation"]);

export default function main(){
	return `
		<container class="p-5">
			<column class="w-50 surface-v1 p-5 gap-1">

				<p class="text-align-center">${window.Lang.use("eMail_confirmation_code_has_been_sent")}</p>

				<form for="eMail_confirmation" x-toast="on:any:message">


					<label>
						<p for='verificationCode'></p>
						<input type='number' name='verificationCode'>
					</label>

					<label>
						<input class="btn btn-primary" type='submit' name='verify' value='${window.Lang.use("verify_eMail")}'>
						<p for='eMail_confirmation'></p>
					</label>

				</form>

				<p class="text-align-center text-size-0-7">
					<warning>Warning:</warning>
					Kindly ensure to review your spam folders too.
				</p>

			</column>
		</container>
	`;
}
