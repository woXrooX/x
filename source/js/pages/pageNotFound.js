"use strict";

export const TITLE = window.Lang.use("pageNotFound");

export default function content(){
	return `
		<container class="p-5">
			<column class="w-50 surface-clean p-5">
				<h1>404</h1>
				<h3 style="color: var(--color-text-secondary);">${window.Lang.use("pageNotFound")}</h3>
			</column>
		</container>
	`;
}
