"use strict";

export const TITLE = "App Is Down";

export default function main(){
	return `
		<container class="p-5">
			<column class="w-50 surface-v1 p-5">
				<x-svg name="${window.CONF["tools"]["app_is_down"]["icon"]}"></x-svg>
				<h1>${window.CONF["tools"]["app_is_down"]["title"]}</h1>
				<h3 class="text-color-secondary">${window.CONF["tools"]["app_is_down"]["explanation"]}</h3>
			</column>
		</container>
	`;
}
