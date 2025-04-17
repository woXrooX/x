export async function before(){
	window.x.Head.set_title("log_out");

	const resp = await window.bridge({for:"log_out_instant"});
	if (!("type" in resp)) return;
	if (resp["type"] != "success") return;

	delete window.session["user"];
	window.x.CSS.detect_color_mode();
	window.dispatchEvent(new CustomEvent("DOM_change", {detail: ["all"]}));
	Hyperlink.locate("/");
}

export default function main(){
	return `
		<container class="padding-5">
			<column class="surface-v1 padding-5">${Lang.use('could_not_log_out_instant')}</column>
		</container>
	`;
}
