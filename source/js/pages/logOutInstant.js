"use strict";

export const TITLE = window.Lang.use("logOut");

export async function before(){
	const resp = await window.bridge("logOutInstant", {for:"logOutInstant"});

	if("type" in resp && resp["type"] == "success"){
		delete window.session["user"];
		CSS.detectColorMode();
		window.dispatchEvent(new CustomEvent("domChange", {detail: ["all"]}));
		Hyperlink.locate("home");
	}
}

export default function content(){
	return `
		<container class="p-5">
			<column class="surface-clean p-5">${Lang.use(couldNotLogOutInstant)}</column>
		</container>
	`;
}
