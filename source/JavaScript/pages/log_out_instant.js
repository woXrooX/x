export const TITLE = window.Lang.use("log_out");

export async function before(){
	const resp = await window.bridge({for:"log_out_instant"}, "/log_out_instant");

	if("type" in resp && resp["type"] == "success"){
		delete window.session["user"];
		x.CSS.detect_color_mode();
		window.dispatchEvent(new CustomEvent("DOM_change", {detail: ["all"]}));
		Hyperlink.locate("home");
	}
}

export default function main(){
	return `
		<container class="padding-5">
			<column class="surface-v1 padding-5">${Lang.use('could_not_log_out_instant')}</column>
		</container>
	`;
}
