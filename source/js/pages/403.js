"use strict";

export const TITLE = 403;

export default function content(){
	return `
		<container class="p-5">
			<column class="w-50 surface-error p-3 gap-0-5">
				<h1>403</h1>
				<h3 class="text-color-secondary">Forbidden</h3>
			</column>
		</container>
	`;
}
