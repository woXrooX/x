export const TITLE = window.Lang.use("root");

export default async function content(){
	return `
		<container class="root p-5 gap-1">

			<row class="flex-row flex-x-start surface-v1 p-2 gap-1">

				<button
					x-post
					x-for="sanitize_users_folders"
					x-trigger="click"

					x-toast

					class="btn btn-warning"
				>SANITIZE USERS FOLDERS</button>

			</row>

			${await all_users_HTML()}

		</container>
	`;
}

async function all_users_HTML(){
	const USERS = await window.bridge({for:"get_all_users"});

	if(!("data" in USERS)) return;

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
