export const TITLE = window.Lang.use("user");

Modal.push_func(async function modal_user_roles(){
	const roles_element = Modal.element_main.querySelector("column#roles");
	
	let user_roles = await window.bridge({"for": "get_user_roles"})
	if("data" in user_roles) user_roles = user_roles["data"];
	else return `<p class="width-100 text-size-0-8 surface-info padding-1">No user roles</p>`;

	console.log(user_roles);
	
	let HTML = '';
	for (const user_role of user_roles) {
		HTML += `
			<label class="d-flex flex-row gap-0-5">
				<input type="checkbox" name="roles" value="${user_role['name']}" ${user_role["assigned"] === 1 ? "checked" : ''} >
				<p for="checkbox">${user_role['name']}</p>
			</label>
		`;
		
	}
	roles_element.innerHTML = `
		<form for="assign_roles">
			${HTML}
			<label>
				<input class="btn btn-primary" type='submit' name='save' value="save">
				<p for='assign_roles'></p>
			</label>
		</form>
	`
})

export default function main(){
	return `
		<container class="padding-5 gap-1">
			${actions_HTML()}
		</container>
	`;

	function actions_HTML(){
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
				<x-modal trigger_selector="x-svg#modal_user_roles" modal_func="modal_user_roles">
					<column id="roles" class="padding-2 gap-1"></column>
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
