export function before(){
	window.x.Head.set_title("users");
}

export default async function main(){ return `<container id="page_x_users" class="padding-5 gap-1"></container>`; }

export async function after(){
	const container = document.querySelector("container#page_x_users");
	Loading.on_element_start(container);
	container.insertAdjacentHTML("beforeend", `
		${await build_live_users_count_HTML()}
		${await build_all_users_HTML()}
	`);
	Loading.on_element_end(container);

	async function build_live_users_count_HTML(){
		const live_users_count = await window.bridge({for:"get_live_users_count"});

		if(!("data" in live_users_count)) return '';

		return `
			<column class="padding-2 surface-v1 min-width-200px width-auto">
				<p class="text-size-0-8 text-color-secondary">live_users_count</p>
				<p class="text-size-2 text-weight-bold">${live_users_count["data"]["live_users"] ?? 0}</p>
			</column>
		`;
	}

	async function build_all_users_HTML(){
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
			<x-table class="surface-v1 padding-2 table-v1 table-zebra table-hover table-bordered table-thead-sticky width-100">
				{
					"searchable": true,
					"head": ${JSON.stringify(HEAD)},
					"body": ${JSON.stringify(BODY)}
				}
			</x-table>
		`;
	}
}


