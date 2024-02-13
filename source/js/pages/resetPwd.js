"use strict";

export const TITLE = 'Reset password';

export default function content() {
	return `
		<container class="p-5">
			<column class="w-50 surface-clean p-5 gap-1">

				<h2>Reset your password</h2>

				<form action="/resetPwd/${window.Router.currentPage["urlArgs"]["TOKEN"]}" for="resetPwd" autocomplete="off">

					<label>
						<p for="password">${window.Lang.use('password')}</p>
						<input type="password" name="password" minlength="${window.CONF['password']['min_length']}" maxlength="${window.CONF['password']['max_length']}">
					</label>

					<label>
						<p for="confirm_password">Confirm password</p>
						<input type="password" name="confirm_password" minlength="${window.CONF['password']['min_length']}" maxlength="${window.CONF['password']['max_length']}"><br>
					</label>

					<label>
						<input  class="btn btn-primary" type="submit" name="Save" value="Save">
						<p for="Save"></p>
					</label>

				</form>

			</column>

		</container>
  `;
}
