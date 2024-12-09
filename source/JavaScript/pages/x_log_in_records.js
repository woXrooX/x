export const TITLE = window.Lang.use("log_in_records");

export default async function main(){return `<container class="p-5 gap-1"></container>`;}

export async function after(){
	const container = document.querySelector("container");
	Loading.on_element(container);
	container.insertAdjacentHTML("beforeend", await build_HTML());
	Loading.on_element(container);

	async function build_HTML(){
		return await log_in_records_HTML();

		async function log_in_records_HTML(){
			let log_in_records = await window.bridge({for:"get_all_log_in_records"});

			if(log_in_records["type"] === "info") return `<p class="w-100 text-size-0-8 surface-info p-1">${Lang.use(log_in_records["message"])}</p>`;
			if(!("data" in log_in_records)) return `<p class="w-100 text-size-0-8 surface-warning p-1">${Lang.use("invalid_response")}</p>`;

			const HEAD = [];
			const BODY = [];

			for(const KEY of Object.keys(log_in_records.data[0])) HEAD.push({"title": KEY});

			for(const i in log_in_records.data) BODY.push(Object.values(log_in_records.data[i]))

			return `
				<column class="surface-v1 p-2 gap-1 w-100">

					<p class="text-size-1-5">db.log_in_records.*</p>

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
	}
}


