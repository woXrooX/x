export function before(){
	window.x.Head.set_title("eMail_confirmation");
}

export default function main(){
	return `
		<container class="padding-5 max-width-1200px">
			<column class="width-50 surface-v1 padding-5 gap-1">
				<p class="text-align-center">${window.Lang.use("eMail_confirmation_code_has_been_sent")}</p>

				<form for="eMail_confirmation" x-toast="on:any:message">
					<label>
						<p for="verification_code"></p>
						<input type="number" name="verification_code" placeholder="Enter code">
					</label>
					<label>
						<input class="btn btn-primary" type="submit" name="verify" value="${window.Lang.use("verify_eMail")}">
						<p for="eMail_confirmation"></p>
					</label>
				</form>

				<p class="surface-info width-100 padding-2 text-size-0-7">Check your spam folder if not received.</p>
			</column>
		</container>
	`;
}
