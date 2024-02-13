"use strict";

export const TITLE = window.Lang.use("logIn");

export default function logIn(){

	return `
		<container class="p-5">
			<column class="w-50 surface-clean p-5 gap-1">

				<h2>${window.Lang.use("logIn")}</h2>

				<form action="logIn" for="logIn" autocomplete="off">

					<label>
						<p for="eMail">${window.Lang.use('eMail')}</p>
						<input type="email" name="eMail">
					</label>

					<label>
						<p for="password">${window.Lang.use('password')}</p>
						<input type="password" name="password" minlength="${window.CONF['password_min_length']}" maxlength="${window.CONF['password_max_length']}"><br>
					</label>

					<label>
						<input class="btn btn-primary" type="submit" name="logIn" value="${window.Lang.use("logIn")}">
						<p for="logIn"></p>
					</label>

				</form>

				<a href="/signUp" class="text-size-0-7">${window.Lang.use("dontHaveAccountGoToSignUp")}</a>
				<a href="/forgotPwd" class="text-size-0-7">Can't remember password?</a>

			</column>
		</container>
	`;
}
