export function before(){
	window.x.Head.set_title("log_out");
}

export default function main(){
	return `
		<container class="padding-5 gap-1">
			<p class="text-size-0-8 text-align-center">${window.Lang.use("if_log_out_wont_be_able_to")}</p>

			<form for="log_out" class="width-50 surface-v1 padding-5">
				<label>
					<input  class="btn btn-primary" type='submit' name='log_out' value='${window.Lang.use("log_out")}'>
					<p for='log_out'>${window.Lang.use("are_you_sure")}</p>
				</label>
			</form>
		</container>
	`;
}
