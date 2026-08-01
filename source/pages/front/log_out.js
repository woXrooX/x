export function before(){
	window.x.Head.set_title("log_out");
}

export default function main(){
	return `
		<container class="padding-5 gap-1 max-width-1200px">
			<p class="text-size-0-8rem text-align-center">${window.Lang.use("if_log_out_wont_be_able_to")}</p>

			<form
				class="width-50 surface-v1 padding-5"

				for="log_out"
				form_func="on_log_out_callback"
			>
				<label>
					<input  class="btn btn-primary" type='submit' name='log_out' value='${window.Lang.use("log_out")}'>
					<p for='log_out'>${window.Lang.use("are_you_sure")}</p>
				</label>
			</form>
		</container>
	`;
}

export async function after() {
	Form.push_func(async function on_log_out_callback(args) {
		try {
			const on_log_out = await import(`/JavaScript/modules/on_log_out.js`);
			await on_log_out.default(args);
		}

		catch (error) {	console.log(error); }
	});
}

