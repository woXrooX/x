export const TITLE = window.Lang.use("root");

export default async function content(){
	return `
		<container class="root p-5 gap-1">

			<row class="flex-row flex-x-start surface-v1 p-2 gap-1">

				<button
					xr-post
					xr-for="sanitize_users_folders"
					xr-trigger="click"

					x-toast

					class="btn btn-warning"
				>SANITIZE USERS FOLDERS</button>

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

	for(const KEY of Object.keys(USERS.data[0])) HEAD.push({"title": KEY});

	for(const i in USERS.data) BODY.push(Object.values(USERS.data[i]))

	return `
		<column class="surface-v1 p-2 gap-1 w-100">

			<h1>db.users.* + db.users_roles.name</h1>

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

			<h1>db.login_records.*</h1>

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
