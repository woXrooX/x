import String_to_Element from "/JavaScript/modules/parser/String_to_Element.js";

export function before() {
	window.x.Head.set_title("users");
}

export default async function main() {
	return `
		<container class="page_x_users padding-5 gap-0-5 max-width-1200px">
			<row class="surface-v1 padding-2 flex-row flex-x-between flex-y-center">
				<row class="flex-row gap-0-5 width-auto flex-y-center flex-x-start">
					<x-link go="history:back" class="btn btn-primary"><x-svg name="arrow_back_v1" color="white"></x-svg></x-link>
					<p>db.users.*</p>
				</row>

				<row class="flex-row gap-0-5 width-auto flex-y-center flex-x-end">
					${build_modal_form_create_user_HTML()}
				</row>
			</row>

			<row class="glances gap-0-5"></row>

			<column class="table width-100"></column>
		</container>
	`;

	function build_modal_form_create_user_HTML(){
		return `
			<x-svg id="modal_form_create_user" name="add" class="btn btn-primary" color="white"></x-svg>
			<x-tooltip trigger_selector="x-svg#modal_form_create_user" class="padding-2 text-size-0-8">${Lang.use("create_user")}</x-tooltip>
			<x-modal trigger_selector="x-svg#modal_form_create_user">
				<form for="create_user" class="padding-2" x-modal="on:success:hide" x-toast="on:any:message">
					<p class="text-align-center text-size-1-5">${Lang.use("create_user")}</p>

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
			const live_users_count = await window.x.Request.make({for:"get_live_users_count"});

			if (!("data" in live_users_count)) return `<p class="width-100 text-size-0-8 surface-info padding-1">${Lang.use("no_data")}</p>`;

			return `
				<column class="padding-2 surface-v1 min-width-200px width-auto">
					<p class="text-size-0-8 text-color-secondary">live_users_count</p>
					<p class="text-size-2 text-weight-bold">${live_users_count["data"]["live_users"] ?? 0}</p>
				</column>
			`;
		}
	});

	DOM.build("column.table", async function build_users_HTML() {
		const users = await window.x.Request.make({for:"get_all_users"});
		if (!("data" in users)) return String_to_Element(`<p class="width-100 text-size-0-8 surface-info padding-1">${Lang.use("no_data")}</p>`);

		const HEAD = [];
		for (const KEY of Object.keys(users.data[0])) HEAD.push({"title": KEY, "sortable": true});
		HEAD.push({"title": "Actions"});

		const BODY = [];
		for (const i in users.data) {
			let arr = Object.values(users.data[i]);

			arr.push(`
				<a href="/x/user/${users.data[i]["id"]}">
					<x-svg
						name="open_in_new_tab" color="white"
						class="btn btn-primary"
					></x-svg>
				</a>
			`);

			BODY.push(arr);
		}

		return window.x.Table.build(
			{
				"page_size": "10",
				"searchable": true,
				"columns": HEAD,
				"rows": BODY
			},
			"surface-v1 width-100 padding-2"
		);
	}, {method: "replaceChildren"});
}
