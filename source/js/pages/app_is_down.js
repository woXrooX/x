export const TITLE = Lang.use("app_is_down");

export default function main(){
	return `
		<container class="p-5">
			<column class="w-50 surface-v1 p-5 gap-1">
				<x-svg name="${window.CONF["tools"]["app_is_down"]["icon"]}"></x-svg>
				<p class="text-align-center text-size-2">${window.CONF["tools"]["app_is_down"]["title"]}</p>
				<p class="text-align-center text-color-secondary">${window.CONF["tools"]["app_is_down"]["explanation"]}</p>
			</column>
		</container>
	`;
}
