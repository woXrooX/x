export const TITLE = window.Lang.use("root");

export default async function main(){return `<container class="root p-5 gap-1"></container>`;}

export async function after(){
	const container = document.querySelector("container");
	Loading.on_element(container);
	container.insertAdjacentHTML("beforeend", await build_HTML());
	Loading.on_element(container);

	async function build_HTML(){
		return await all_users_HTML();

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
	}
}


