export const TITLE = window.Lang.use("user");

export default function main(){
	return `<container class="padding-5 gap-1"></container>`;
}

export async function after(){
	const container = document.querySelector("container");
	Loading.on_element_start(container);

	let user = await window.bridge({for:"get_user"});
	if("data" in user) user = user["data"];
	else return `<p class="width-100 text-size-0-8 surface-info padding-1">No data to show.</p>`;
	
	container.insertAdjacentHTML("beforeend", `
		${await build_actions_HTML()}
		${await build_user_data_HTML()}
		${await build_user_log_in_records_HTML()}
	`);
	Loading.on_element_end(container);

	async function build_actions_HTML(){
		return `
			<row class="padding-1 surface-v1 gap-0-5 flex-row flex-x-start">
				<x-svg
					name="mark_eMail_read"

					xr-post
					xr-for="resend_eMail_confirmation"

					x-toast="on:any:message"

					class="btn btn-info"
				></x-svg>


				${await build_modal_form_update_roles_HTML()}


				<x-svg
					name="delete"

					xr-post
					xr-for="delete_user"

					x-toast="on:any:message"

					class="btn btn-error"
				></x-svg>
			</row>
		`;

		async function build_modal_form_update_roles_HTML(){
			let user_roles = await window.bridge({for:"get_user_roles"});
			if("data" in user_roles) user_roles = user_roles["data"];
			else return `<p class="width-100 text-size-0-8 surface-info padding-1">${window.Lang.use("no_roles")}</p>`;
			
			let assigned_roles = (user.roles_list || "").split(", ");
			
			let HTML = '';
			for (const user_role in user_roles) HTML += `
				<label class="d-flex flex-row gap-0-5">
					<input type="checkbox" name="roles" value="${user_role}" ${assigned_roles.includes(user_role) ? "checked" : ""}>
					<p for="checkbox">${user_role}</p>
				</label>
			`;				

			return `
				<x-svg name="gear" id="modal_user_roles" class="btn btn-info"></x-svg>
				<x-modal trigger_selector="x-svg#modal_user_roles">
					<column id="roles" class="padding-2 gap-1">
						<form for="update_roles" x-modal="on:success:hide" x-toast="on:any:message">
							${HTML}
							<input class="btn btn-primary" type='submit' name='save' value="save">
							<p for='update_roles'></p>
						</form>
					</column>
				</x-modal>
			`;
		}
	}

	async function build_user_data_HTML(){
		let HTML = '';
		for(const key in user) HTML += `<p class="text-size-1"><span class="text-weight-bold text-color-secondary text-size-0-7">${key}:</span> ${user[key]}</p>`;

		return `<column class="flex-y-start surface-v1 padding-2 gap-0-3 width-100">${HTML}</column>`;
	}

	async function build_user_log_in_records_HTML(){
		let resp = await window.bridge({for:"get_user_log_in_records"});

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
