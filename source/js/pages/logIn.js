export const TITLE = window.Lang.use("log_in");

export default function main(){
	return `
		<container class="p-5 max-w-600px">
			<form for="log_in" autocomplete="off" class="surface-v1 p-5">

				<h2 class="text-align-center">${window.Lang.use("log_in")}</h2>

				<label>
					<p for="eMail">${window.Lang.use('eMail')}</p>
					<input type="email" name="eMail">
				</label>

				<label>
					<p for="password">${window.Lang.use('password')}</p>
					<input type="password" name="password" minlength="${window.CONF['password_min_length']}" maxlength="${window.CONF['password_max_length']}"><br>
				</label>

				<label>
					<input class="btn btn-primary" type="submit" name="log_in" value="${window.Lang.use("log_in")}">
					<p for="log_in"></p>
				</label>

				<a href="/signUp" class="text-align-center text-size-0-7">${window.Lang.use("dont_have_account_go_to_sign_up")}</a>
				<a href="/requestPasswordRecovery" class="text-align-center text-size-0-7">${Lang.use("cannot_remember_password")}</a>

			</form>
		</container>
	`;
}
