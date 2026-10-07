export function before() {
	window.x.Head.set_title("user");
}

export default function main() {
	return `
		<container class="padding-5 gap-0-5 max-width-1200px">
			<row class="surface-v1 padding-2 flex-row justify-content-space-between align-items-center">
				<row class="flex-row gap-0-5 width-auto align-items-center justify-content-flex-start">
					<x-link go="history:back" class="btn btn-primary"><x-svg name="arrow_back_v1" color="white"></x-svg></x-link>
					<p>User</p>
				</row>

				<row class="actions flex-row gap-0-5 width-auto align-items-center justify-content-flex-end"></row>
			</row>

			<column class="user_data width-100"></column>

			<column class="log_in_records width-100"></column>
		</container>
	`;
}

export async function after() {
	let user = await window.x.Request.make({ payload: {for:"get:user"} });

	if ("data" in user) user = user["data"];
	else return `<p class="surface-info width-100 padding-1 text-size-0-8rem">${Lang.use("no_data")}</p>`;

	DOM.build("row.actions", async function build_actions_HTML() {
		return `
			${build_modal_XR_resend_eMail_confirmation_HTML()}
			${await build_modal_form_update_roles_HTML()}
			${build_modal_XR_delete_user_HTML()}
		`;

		function build_modal_XR_resend_eMail_confirmation_HTML() {
			return `
				<x-svg id="modal_XR_resend_eMail_confirmation" name="mark_eMail_read" color="white" class="btn btn-info"></x-svg>
				<x-modal trigger_selector="x-svg#modal_XR_resend_eMail_confirmation">
					<column class="gap-1 padding-2">
						<p class="text-size-1-1rem">Are you sure you want to resend email confirmation?</p>
						<button
							XR-post
							XR-for="resend_eMail_confirmation"

							x-toast="on:any:message"
							x-modal="on:success:hide"

							class="btn btn-success"
						>Yes, resend!</button>
					</column>
				</x-modal>
			`;
		}

		async function build_modal_form_update_roles_HTML() {
			let user_roles = await window.x.Request.make({ payload: {for:"get:user_roles"} });

			if ("data" in user_roles) user_roles = user_roles["data"];
			else return '';

			let assigned_roles = (user.roles_list || "").split(", ");

			let HTML = '';
			for (const user_role in user_roles) HTML += `
				<label>
					<input type="checkbox" name="roles" value="${user_role}" ${assigned_roles.includes(user_role) ? "checked" : ""}>
					<p for="roles">${user_role}</p>
				</label>
			`;

			return `
				<x-svg name="gear_account_box" id="modal_user_roles" class="btn btn-info"></x-svg>
				<x-modal trigger_selector="x-svg#modal_user_roles">
					<form for="update:roles" class="padding-2 gap-0-5" x-modal="on:success:hide" x-toast="on:any:message">
						${HTML}
						<button type="submit" class="btn btn-primary"><x-svg name="save" color="white"></x-svg></button>
					</form>
				</x-modal>
			`;
		}

		function build_modal_XR_delete_user_HTML() {
			return `
				<x-svg id="modal_XR_delete_user" name="delete" color="white" class="btn btn-error"></x-svg>
				<x-modal trigger_selector="x-svg#modal_XR_delete_user">
					<column class="gap-1 padding-2">
						<p class="text-size-1-1rem">Are you sure you want to delete this user?</p>
						<button
							XR-post
							XR-for="delete_user"

							x-toast="on:any:message"
							x-modal="on:success:hide"

							class="btn btn-error"
						>Yes, delete!</button>
					</column>
				</x-modal>
			`;
		}
	});

	DOM.build("column.user_data", async function build_user_data_HTML() {
		let HTML = '';
		for (const key in user) HTML += `
			<span class="text-color-secondary text-size-0-8rem">
				${key}:
				<span class="text-color-primary text-size-1rem">${user[key]}</span>
			</span>
		`;

		return `<column class="align-items-flex-start surface-v1 padding-2 gap-0-3 width-100">${HTML}</column>`;
	});

	DOM.build("column.log_in_records", async function build_log_in_records_HTML() {
		let log_in_records = await window.x.Request.make({ payload: {for: "get:user_log_in_records"} });

		if (log_in_records["type"] != "success") return `<p class="surface-${log_in_records["type"]} width-100 padding-1 text-size-0-8rem">${window.Lang.use(log_in_records["message"])}</p>`;
		else if ("data" in log_in_records) log_in_records = log_in_records["data"];
		else return `<p class="surface-info width-100 padding-1 text-size-0-8rem">${Lang.use("no_data")}</p>`;


		return window.x.Table.build(
			{
				"id": "user_log_in_records",
				"page_size": 10,
				"searchable": true,
				"downloadable": true,
				"columns": [
					{ "title": "id" },
					{ "title": "metadata_created_at" },
					{ "title": "IP_address" },
					{ "title": "user_agent" },
					{ "title": "message" }
				],
				"rows": build_table_rows()
			},
			"width-100"
		);

		function build_table_rows() {
			const ROWS = [];

			for (const log_in_record of log_in_records) ROWS.push({
				"id": log_in_record["id"],

				"data": [
					{ "value": log_in_record["id"] },
					{ "value": log_in_record["metadata_created_at"] },
					{ "value": log_in_record["IP_address"] },
					{ "value": log_in_record["user_agent"] },
					{ "value": log_in_record["message"] }
				]
			});

			return ROWS;
		}
	}, {method: "replaceChildren"});
}
