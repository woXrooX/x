export const TITLE = window.Lang.use("users");

export default async function main(){return `<container class="padding-5 gap-1"></container>`;}

export async function after(){
	const container = document.querySelector("container");
	Loading.on_element_start(container);
	container.insertAdjacentHTML("beforeend", await build_HTML());
	Loading.on_element_end(container);

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
}


