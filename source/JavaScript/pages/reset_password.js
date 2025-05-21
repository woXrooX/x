export function before(){
	window.x.Head.set_title("reset_password");
}

export default function main(){
	return `
		<container class="padding-5 max-width-600px">
			<form action="/reset_password/${window.Router.current_page["URL_args"]["TOKEN"]}" for="reset_password" autocomplete="off" class="surface-v1 padding-5 gap-1" x-toast="on:any:message">

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
					<input  class="btn btn-primary" type="submit" name="reset_password" value="Save">
					<p for="reset_password"></p>
				</label>

			</form>
		</container>
  `;
}
