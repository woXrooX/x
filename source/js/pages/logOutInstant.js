"use strict";

export const TITLE = window.Lang.use("log_out");

export async function before(){
	const resp = await window.bridge({for:"logOutInstant"}, "/logOutInstant");

	if("type" in resp && resp["type"] == "success"){
		delete window.session["user"];
		x.CSS.detectColorMode();
		window.dispatchEvent(new CustomEvent("domChange", {detail: ["all"]}));
		Hyperlink.locate("home");
	}
}

export default function main(){
	return `
		<container class="p-5">
			<column class="surface-v1 p-5">${Lang.use('could_not_log_out_instant')}</column>
		</container>
	`;
}
