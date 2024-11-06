export const TITLE = window.Lang.use("log_out");

export default function main(){

	return `
		<container class="p-5 gap-1">
			<p class="text-size-0-8 text-align-center">${window.Lang.use("if_log_out_wont_be_able_to")}</p>

			<form for="log_out" class="w-50 surface-v1 p-5">
				<label>
					<input  class="btn btn-primary" type='submit' name='log_out' value='${window.Lang.use("log_out")}'>
					<p for='log_out'>${window.Lang.use("are_you_sure")}</p>
				</label>
			</form>
		</container>
	`;
}
