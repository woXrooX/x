"use strict";

export const TITLE = 'Forgot Password';

export default function content() {
	return `
		<container class="p-5">
			<column class="w-50 surface-clean p-5 gap-1">

				<h2>Forgot Password</h2>

				<form action="/requestPasswordRecovery" for="requestPasswordRecovery" autocomplete="off" x-toast>

					<label>
						<p for="eMail">${window.Lang.use('eMail')}</p>
						<input type="eMail" name="eMail">
					</label>

					<label>
						<input  class="btn btn-primary" type="submit" name="requestPasswordRecovery" value="Check">
						<p for="requestPasswordRecovery"></p>
					</label>

				</form>

				<a href="/signUp" class="text-size-0-7">${window.Lang.use("dontHaveAccountGoToSignUp")}</a>

			</column>

		</container>
  `;
}
