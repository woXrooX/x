export const TITLE = window.Lang.use('signUp');

export default function content() {
	return `
		<container class="p-5 max-w-600px">
			<form action="/signUp" for="signUp" autocomplete="off" class="surface-v1 p-5">

				<h2 class="text-align-center">${window.Lang.use('signUp')}</h2>

				<label>
					<p for="eMail">${window.Lang.use('eMail')}</p>
					<input type="eMail" name="eMail">
				</label>

				<label>
					<p for="password">${window.Lang.use('password')}</p>
					<input type="password" name="password" minlength="${window.CONF['password']['min_length']}" maxlength="${window.CONF['password']['max_length']}"><br>
				</label>

				<label>
					<input  class="btn btn-primary" type="submit" name="signUp" value="${window.Lang.use('signUp')}">
					<p for="signUp"></p>
				</label>

				<a href="/logIn" class="text-align-center text-size-0-7">${window.Lang.use('haveAccountGoToLogIn')}</a>

			</form>
		</container>
  `;
}
