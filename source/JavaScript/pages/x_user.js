export const TITLE = window.Lang.use("user");

export default function main(){
	return `
		<container class="p-5 gap-1">
			${actions_HTML()}
		</container>
	`;

	function actions_HTML(){
		return `
			<row class="p-1 surface-v1 gap-0-5 flex-row flex-x-start">
				<x-svg
					name="mark_eMail_read"

					xr-post
					xr-for="resend_eMail_confirmation"

					x-toast="on:any:message"

					class="btn btn-info"
				></x-svg>

				<x-svg
					name="delete"

					xr-post
					xr-for="delete_user"

					x-toast="on:any:message"

					class="btn btn-error"
				></x-svg>
			</row>
		`;
	}
}

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element(container);
	container.insertAdjacentHTML("beforeend", `
		${await build_user_data_HTML()}
		${await build_user_log_in_records_HTML()}
	`);
	Loading.on_element(container);

	async function build_user_data_HTML(){
		let resp = await window.bridge({for:"get_user"});
		if("data" in resp) resp = resp["data"];
		else return `<p class="w-100 text-size-0-8 surface-info p-1">No data to show.</p>`;

		let HTML = '';
		for(const key in resp) HTML += `<p class="text-size-0-8"><span class="text-weight-bold">${key}</span>: ${resp[key]}</p>`;
		return `<column class="flex-y-start surface-v1 p-1 w-100">${HTML}</column>`;
	}

	async function build_user_log_in_records_HTML(){
		let resp = await window.bridge({for:"get_user_log_in_records"});
		console.log(resp);

		if("data" in resp) resp = resp["data"];
		else return `<p class="w-100 text-size-0-8 surface-info p-1">No data to show.</p>`;

		const HEAD = [];
		const BODY = [];

		for(const KEY of Object.keys(resp[0])) HEAD.push({"title": KEY, "sortable": true});

		for(const i in resp) BODY.push(Object.values(resp[i]));

		return `
			<column class="surface-v1 p-2 gap-1 w-100 flex-y-start">
				<x-table class="scrollbar-x table-v1 table-zebra table-hover table-bordered w-100">
					{
						"searchable": true,
						"head": ${JSON.stringify(HEAD)},
						"body": ${JSON.stringify(BODY)}
					}
				</x-table>
			</column>
		`;
	}
}
