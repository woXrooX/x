export const TITLE = window.Lang.use("user");

export default async function main(){
	return `
		<container class="padding-5 gap-1">
			${await actions_HTML()}
		</container>
	`;

	async function actions_HTML(){
		
		return `
			<row class="padding-1 surface-v1 gap-0-5 flex-row flex-x-start">
				<x-svg
					name="mark_eMail_read"

					xr-post
					xr-for="resend_eMail_confirmation"

					x-toast="on:any:message"

					class="btn btn-info"
				></x-svg>

				<x-svg name="gear" id="modal_user_roles" class="btn btn-info"></x-svg>
				<x-modal trigger_selector="x-svg#modal_user_roles">
					${await roles_HTML()}
				</x-modal>

				<x-svg
					name="delete"

					xr-post
					xr-for="delete_user"

					x-toast="on:any:message"

					class="btn btn-error"
				></x-svg>
			</row>
		`;

		async function roles_HTML(){
			let roles = await window.bridge({"for": "get_user_roles"})
			if("data" in roles) roles = roles["data"];
			else return `<p class="width-100 text-size-0-8 surface-info padding-1">No user roles</p>`;

			let HTML = '';
			for (const role of roles) {
				HTML += `
					<label class="display-flex flex-row flex-y-center gap-0-3">
						<input type="checkbox" name="roles" value="${role['name']}" ${role["assigned"] === 1 ? "checked" : ''} >
						<p for="checkbox">${role['name']}</p>
					</label>
				`;
			}
			
			return`
				<column id="roles" class="padding-2 gap-1">
					<form for="assign_roles" x-modal="on:success:hide" x-toast="on:any:message">
						${HTML}
						<input class="btn btn-primary" type='submit' name='save' value="save">
						<p for='assign_roles'></p>
					</form>
				</column>
			`;
		}
	}
}

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element_start(container);
	container.insertAdjacentHTML("beforeend", `
		${await build_user_data_HTML()}
		${await build_user_log_in_records_HTML()}
	`);
	Loading.on_element_end(container);

	async function build_user_data_HTML(){
		let resp = await window.bridge({for:"get_user"});
		if("data" in resp) resp = resp["data"];
		else return `<p class="width-100 text-size-0-8 surface-info padding-1">No data to show.</p>`;

		let HTML = '';
		for(const key in resp) HTML += `<p class="text-size-0-8"><span class="text-weight-bold">${key}</span>: ${resp[key]}</p>`;
		return `<column class="flex-y-start surface-v1 padding-1 width-100">${HTML}</column>`;
	}

	async function build_user_log_in_records_HTML(){
		let resp = await window.bridge({for:"get_user_log_in_records"});
		console.log(resp);

		if("data" in resp) resp = resp["data"];
		else return `<p class="width-100 text-size-0-8 surface-info padding-1">No data to show.</p>`;

		const HEAD = [];
		const BODY = [];

		for(const KEY of Object.keys(resp[0])) HEAD.push({"title": KEY, "sortable": true});

		for(const i in resp) BODY.push(Object.values(resp[i]));

		return `
			<column class="surface-v1 padding-2 gap-1 width-100 flex-y-start">
				<x-table class="scrollbar-x table-v1 table-zebra table-hover table-bordered width-100">
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
