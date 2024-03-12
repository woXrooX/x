"use strict";

export const TITLE = "App Is Down";

export default function content(){
	return `
		<container class="p-5">
			<column class="w-50 surface-v1 p-5">
				<x-svg name="${window.CONF["tools"]["appIsDown"]["icon"]}"></x-svg>
				<h1>${window.CONF["tools"]["appIsDown"]["title"]}</h1>
				<h3 class="text-color-secondary">${window.CONF["tools"]["appIsDown"]["explanation"]}</h3>
			</column>
		</container>
	`;
}
