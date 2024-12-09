export const TITLE = Lang.use("app_is_down");

export function header(){ return false; }

export default function main(){
	return `
		<container class="p-5 max-w-1200px">
			<column class="w-auto surface-info p-3 gap-0-5">
				<x-svg class="text-size-5" name="${window.CONF["tools"]["app_is_down"]["icon"]}"></x-svg>
				<p class="text-align-center text-size-2">${window.CONF["tools"]["app_is_down"]["title"]}</p>
				<p class="text-align-center text-color-secondary">${window.CONF["tools"]["app_is_down"]["description"]}</p>
			</column>
		</container>
	`;
}

export function footer(){ return false; }
