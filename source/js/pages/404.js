"use strict";

export const TITLE = 404;

export default function main(){
	return `
		<container class="p-5">
			<column class="w-50 surface-error p-3 gap-0-5">
				<h1>404</h1>
				<h3 class="text-color-secondary">${window.Lang.use("not_found")}</h3>
			</column>
		</container>
	`;
}
