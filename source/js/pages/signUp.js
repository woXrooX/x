export const TITLE = window.Lang.use('sign_up');

export default function main(){
	return `
		<container class="p-5 max-w-600px">
			<form for="sign_up" autocomplete="off" class="surface-v1 p-5">

				<h2 class="text-align-center">${window.Lang.use('sign_up')}</h2>

				<label>
					<p for="eMail">${window.Lang.use('eMail')}</p>
					<input type="eMail" name="eMail">
				</label>

				<label>
					<p for="password">${window.Lang.use('password')}</p>
					<input type="password" name="password" minlength="${window.CONF['password']['min_length']}" maxlength="${window.CONF['password']['max_length']}"><br>
				</label>

				<label>
					<input  class="btn btn-primary" type="submit" name="sign_up" value="${window.Lang.use('sign_up')}">
					<p for="sign_up"></p>
				</label>

				<a href="/logIn" class="text-align-center text-size-0-7">${window.Lang.use('have_account_go_to_log_in')}</a>

			</form>
		</container>
	`;
}
