export const TITLE = window.Lang.use("app_analytics");

export default async function main(){ return `<container class="max-w-1200px p-5 gap-1"></container>`; }

export async function after(){
	const container = document.querySelector("container");
	Loading.on_element(container);
	container.insertAdjacentHTML("beforeend", await build_HTML());
	Loading.on_element(container);

	async function build_HTML(){
		let resp = await window.bridge({for:"get_all_access_logs"});
		if("data" in resp) resp = resp["data"];
		else return `<p class="w-100 text-size-0-8 surface-info p-1">No data to show.</p>`;

		return `
			<column class="surface-v1 p-2 gap-1 w-100 flex-y-start">

				<p>${resp[0][1]} - ${resp[resp.length-1][1]}</p>

				${build_requests_by_counts_HTML()}

				${build_raw_requests_HTML()}

			</column>
		`;

		function build_requests_by_counts_HTML(){
			// Formatting duplicates
			const requests_by_counts = {};
			for(const cell of resp)
				if(cell[2] in requests_by_counts) requests_by_counts[cell[2]] = requests_by_counts[cell[2]] + 1;
				else requests_by_counts[cell[2]] = 1;

			// List formatting for x-table
			const requests_by_counts_list = [];
			for(const key in requests_by_counts) requests_by_counts_list.push([key, requests_by_counts[key]]);

			return `
				<details class="surface-v1 w-100 text-size-0-8">
					<summary class="surface-v1 bg-4 p-1 px-2">Requests by counts</summary>

					<column class="p-3">
						<x-table class="table-v1 table-zebra table-hover table-bordered w-100">
							{
								"searchable": true,
								"head": [
									{"title": "HTTP method and path", "sortable": true},
									{"title": "Request count", "sortable": true}
								],
								"body": ${JSON.stringify(requests_by_counts_list)}
							}
						</x-table>
					</column>
				</details>
			`;
		}

		function build_raw_requests_HTML(){
			return `
				<details class="surface-v1 w-100 text-size-0-8">
					<summary class="surface-v1 bg-4 p-1 px-2">All requests</summary>

					<column class="p-3">
						<x-table class="table-v1 table-zebra table-hover table-bordered w-100">
							{
								"searchable": true,
								"head": [
									{"title": "IP address"},
									{"title": "Timestamp"},
									{"title": "HTTP method and path"},
									{"title": "Status code"},
									{"title": "Bytes sent"},
									{"title": "Referrer"},
									{"title": "User agent"},
									{"title": "Client IP"},
									{"title": "Response time"}
								],
								"body": ${JSON.stringify(resp)}
							}
						</x-table>
					</column>
				</details>
			`;
		}
	}
}
