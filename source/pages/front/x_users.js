import { timestamp_to_human_readable_v1, timestamptz_to_local_timestamp } from "/JavaScript/modules/datetime/datetime.js";

export function before() {
	window.x.Head.set_title("users");
}

export default async function main() {
	return `
		<container class="page_x_users padding-2 gap-0-5">
			<row class="surface-v1 padding-2 flex-row justify-content-space-between align-items-center">
				<row class="flex-row gap-0-5 width-auto align-items-center justify-content-flex-start">
					<x-link go="history:back" class="btn btn-primary"><x-svg name="arrow_back_v1" color="white"></x-svg></x-link>
					<p>DB.users.*</p>
				</row>

				<row class="flex-row gap-0-5 width-auto align-items-center justify-content-flex-end">
					${build_modal_form_create_user_HTML()}
				</row>
			</row>

			<row class="glances gap-0-5"></row>

			<column class="table width-100"></column>
		</container>
	`;

	function build_modal_form_create_user_HTML(){
		return `
			<x-svg id="modal_form_create_user" name="person_add" class="btn btn-primary" color="white"></x-svg>
			<x-tooltip trigger_selector="x-svg#modal_form_create_user" class="padding-1 text-size-0-6rem">${Lang.use("create_user")}</x-tooltip>
			<x-modal trigger_selector="x-svg#modal_form_create_user">
				<form for="create_user" class="padding-2" x-modal="on:success:hide" x-toast="on:any:message">
					<p class="text-align-center text-size-1-5rem">${Lang.use("create_user")}</p>

					<row class="gap-0-5">
						<label>
							<p for="first_name">${window.Lang.use("first_name")}</p>
							<input type="text" name="first_name">
						</label>

						<label>
							<p for="last_name">${window.Lang.use("last_name")}</p>
							<input type="text" name="last_name">
						</label>
					</row>

					<label>
						<p for="eMail">${window.Lang.use("eMail")}</p>
						<input type="email" name="eMail">
					</label>

					<label>
						<p for="password">${window.Lang.use("password")}</p>
						<input type="password" name="password">
					</label>

					<label>
						<button type="submit" class="btn btn-primary"><x-svg name="save" color="white"></x-svg></button>
						<p for="create_user"></p>
					</label>
				</form>
			</x-modal>
		`;
	}
}

export async function after() {
	DOM.build("row.glances", async function build_glances_HTML() {
		return `
			${await build_live_users_count_HTML()}
		`;

		async function build_live_users_count_HTML() {
			const live_users_count = await window.x.Request.make({ payload: {for:"get_live_users_count"} });

			if (!("data" in live_users_count)) return `<p class="width-100 text-size-0-8rem surface-info padding-1">${Lang.use("no_data")}</p>`;

			return `
				<column class="padding-2 surface-v1 min-width-200px width-auto">
					<p class="text-size-0-8rem text-color-secondary">live_users_count</p>
					<p class="text-size-2rem text-weight-bold">${live_users_count["data"]["live_users"] ?? 0}</p>
				</column>
			`;
		}
	});

	DOM.build("column.table", async function build_users_HTML() {
		let users = await window.x.Request.make({ payload: {for: "get:users"} });

		if (users["type"] != "success") return `<p class="surface-${users["type"]} width-100 padding-1 text-size-0-8rem">${window.Lang.use(users["message"])}</p>`;
		else if ("data" in users) users = users["data"];
		else return `<p class="surface-info width-100 padding-1 text-size-0-8rem">${Lang.use("no_data")}</p>`;

		return window.x.Table.build(
			{
				"id": "users",
				"page_size": "all",
				"searchable": true,
				"downloadable": true,
				"columns": [
					{
						"title": "id",
						"formatter": (cell) => `<a href="/x/user/${cell["value"]}" class="text-decoration-underline">${cell["value"]}</a>`
					},
					{
						"title": "eMail"
					},
					{
						"title": "full_name"
					},
					{
						"title": "roles"
					},
					{
						"title": "last_heartbeat_at",
						"formatter": (cell) => cell["value"] === null ? '-' : timestamp_to_human_readable_v1(cell["value"])
					},
					{
						"title": "flag_deleted_at",
						"formatter": (cell) => cell["value"] === null ? '-' : timestamptz_to_local_timestamp(cell["value"])
					}
				],
				"rows": build_table_rows()
			},
			"width-100"
		);

		function build_table_rows() {
			const ROWS = [];

			for (const user of users) ROWS.push({
				"id": user["id"],
				"data": [
					{ "value": user["id"] },
					{ "value": user["eMail"] },
					{ "value": user["full_name"] },
					{ "value": user["roles_list"] },
					{ "value": user["last_heartbeat_at"] },
					{
						"value": user["flag_deleted_at"],
						"classes": user["flag_deleted_at"] != null ? "bg-error" : ''
					}
				]
			});

			return ROWS;
		}
	}, {method: "replaceChildren"});
}
