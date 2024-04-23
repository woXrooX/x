export const TITLE = window.Lang.use("logIn");

export default function logIn(){
	return `
		<container class="p-5 max-w-600px">
			<form action="/logIn" for="logIn" autocomplete="off" class="surface-v1 p-5">

				<h2 class="text-align-center">${window.Lang.use("logIn")}</h2>

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

				<a href="/signUp" class="text-align-center text-size-0-7">${window.Lang.use("dontHaveAccountGoToSignUp")}</a>
				<a href="/requestPasswordRecovery" class="text-align-center text-size-0-7">${Lang.use("cannot_remember_password")}</a>

			</form>
		</container>
	`;
}
