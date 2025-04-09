export function before(){
	window.x.Head.set_title("password_recovery");
}

export default function main(){
	return `
		<container class="padding-5 max-width-600px">
			<form for="request_password_recovery" autocomplete="off" class="surface-v1 padding-5 gap-1" x-toast="on:any:message">

				<h2>${window.Lang.use("password_recovery")}</h2>

				<label>
					<p for="eMail">${window.Lang.use('eMail')}</p>
					<input type="eMail" name="eMail">
				</label>

				<label>
					<input  class="btn btn-primary" type="submit" name="request_password_recovery" value="Check">
					<p for="request_password_recovery"></p>
				</label>

			</form>
		</container>
	`;
}
