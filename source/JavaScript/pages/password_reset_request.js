export function before(){
	window.x.Head.set_title("reset_password");
}

export default function main(){
	return `
		<container class="padding-5 max-width-600px">
			<form for="password_reset_request" autocomplete="off" class="surface-v1 padding-5 gap-1" x-toast="on:any:message">
				<h2>${window.Lang.use("reset_password")}</h2>

				<label>
					<p for="eMail">${window.Lang.use('eMail')}</p>
					<input type="eMail" name="eMail">
				</label>

				<label>
					<input  class="btn btn-primary" type="submit" name="password_reset_request" value="Check">
					<p for="password_reset_request"></p>
				</label>
			</form>
		</container>
	`;
}
