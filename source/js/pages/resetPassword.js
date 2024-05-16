"use strict";

export const TITLE = 'Reset password';

export default function main(){
	return `
		<container class="p-5 max-w-600px">
			<form action="/resetPassword/${window.Router.currentPage["urlArgs"]["TOKEN"]}" for="resetPassword" autocomplete="off" class="surface-v1 p-5 gap-1" x-toast>

				<h2>Reset your password</h2>

				<label>
					<p for="password">${window.Lang.use('password')}</p>
					<input type="password" name="password" minlength="${window.CONF['password']['min_length']}" maxlength="${window.CONF['password']['max_length']}">
				</label>

				<label>
					<p for="confirm_password">Confirm password</p>
					<input type="password" name="confirm_password" minlength="${window.CONF['password']['min_length']}" maxlength="${window.CONF['password']['max_length']}"><br>
				</label>

				<label>
					<input  class="btn btn-primary" type="submit" name="resetPassword" value="Save">
					<p for="resetPassword"></p>
				</label>

			</form>
		</container>
  `;
}
