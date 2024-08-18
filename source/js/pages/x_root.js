export const TITLE = window.Lang.use("root");

export default async function content(){
	return `
		<container class="root p-5 gap-1">

			<row class="flex-row flex-x-start surface-v1 p-2 gap-0-5">

				<button
					xr-post
					xr-for="sanitize_users_folders"
					xr-trigger="click"

					x-toast="on:any:message"

					class="btn btn-warning"
				>SANITIZE USERS FOLDERS</button>

				<x-svg class="modal_eMail_write btn btn-info" name="eMail"></x-svg>
				<x-modal trigger_selector="x-svg.modal_eMail_write">
					<form for="eMail_send" class="p-1" x-modal="on:success:hide" x-toast="on:any:message">
						<label>
							<p for="local_part">Local-part</p>
							<input type="text" name="local_part">
						</label>

						<label>
							<p for="to_email">To</p>
							<input type="eMail" name="to_email">
						</label>

						<label>
							<p for="subject">Subject</p>
							<input type="text" name="subject">
						</label>

						<label>
							<p for="content">Content</p>
							<textarea name="content" rows="5"></textarea>
						</label>

						<label>
							<input class="btn btn-primary" type="submit" name="send" value="Send">
							<p for="eMail_send"></p>
						</label>
					</form>
				</x-modal>

			</row>

			${await all_users_HTML()}

			${await login_records_HTML()}

		</container>
	`;
}

async function all_users_HTML(){
	const USERS = await window.bridge({for:"get_all_users"});

	if(!("data" in USERS)) return '';

	const HEAD = [];
	const BODY = [];

	for(const KEY of Object.keys(USERS.data[0])) HEAD.push({"title": KEY, "sortable": true});
	HEAD.push({"title": "Actions", "encoded": true});

	for(const i in USERS.data){
		let arr = Object.values(USERS.data[i]);
		arr.push(encodeURIComponent(`
			<a href="/x/user/${USERS.data[i]["id"]}">
				<x-svg
					name="open_in_new_tab" color="white"
					class="btn btn-primary"
				></x-svg>
			</a>
		`));
		BODY.push(arr);
	}

	return `
		<column class="surface-v1 p-2 gap-1 w-100 flex-y-start">
			<p class="text-size-1-5">Users count: ${USERS["data"].length}</p>
			<p class="text-size-0-9 text-color-secondary">DBs: db.users.* + db.users_roles.name</p>

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

async function login_records_HTML(){
	let login_records = await window.bridge({for:"get_all_login_records"});

	if(login_records["type"] === "info") return `<p class="w-100 text-size-0-8 surface-info p-1">${Lang.use(login_records["message"])}</p>`;
	if(!("data" in login_records)) return `<p class="w-100 text-size-0-8 surface-warning p-1">${Lang.use("invalid_response")}</p>`;

	const HEAD = [];
	const BODY = [];

	for(const KEY of Object.keys(login_records.data[0])) HEAD.push({"title": KEY});

	for(const i in login_records.data) BODY.push(Object.values(login_records.data[i]))

	return `
		<column class="surface-v1 p-2 gap-1 w-100">

			<p class="text-size-1-5">db.login_records.*</p>

			<x-table class="scrollbar-x table-v1 table-zebra table-hover table-bordered max-vw-90">
				{
					"searchable": true,
					"head": ${JSON.stringify(HEAD)},
					"body": ${JSON.stringify(BODY)}
				}
			</x-table>

		</column>
	`;

}
