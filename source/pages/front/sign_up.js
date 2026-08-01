export function before(){
	window.x.Head.set_title("sign_up");
}

export default function main(){
	return `
		<container class="page_sign_up padding-5 justify-content-center bg-animated-gradient-v1">
			<form
				class="max-width-600px surface-v1 padding-5"
				autocomplete="off"

				for="sign_up"
				form_func="on_sign_up_callback"
			>
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

				<a href="/log_in" class="text-align-center text-size-0-7rem">${window.Lang.use('have_account_go_to_log_in')}</a>
			</form>
		</container>
	`;
}

export async function after() {
	Form.push_func(async function on_sign_up_callback(args) {
		try {
			const on_sign_up = await import(`/JavaScript/modules/on_sign_up.js`);
			await on_sign_up.default(args);
		}

		catch (error) {	console.log(error); }
	});
}
