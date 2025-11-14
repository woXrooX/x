export function before(){
	window.x.Head.set_title("reset_password");
}

export default function main(){
	return `
		<container class="padding-5 max-width-600px">
			<form
				action="/password_reset/${window.x.Router.current_route["URL_args"]["TOKEN"]}"
				for="password_reset"
				autocomplete="off"
				class="surface-v1 padding-5 gap-1" x-toast="on:any:message"
			>
				<h2>${window.Lang.use("reset_password")}</h2>

				<label>
					<p for="new_password">${window.Lang.use("new_password")}</p>
					<input type="password" name="new_password" minlength="${window.CONF['password']['min_length']}" maxlength="${window.CONF['password']['max_length']}">
				</label>

				<label>
					<p for="confirm_new_password">${window.Lang.use("confirm_new_password")}</p>
					<input type="password" name="confirm_new_password" minlength="${window.CONF['password']['min_length']}" maxlength="${window.CONF['password']['max_length']}"><br>
				</label>

				<label>
					<input  class="btn btn-primary" type="submit" name="password_reset" value="Save">
					<p for="password_reset"></p>
				</label>
			</form>
		</container>
  `;
}
