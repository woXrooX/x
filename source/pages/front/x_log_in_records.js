export function before() {
	window.x.Head.set_title("log_in_records");
}

export default async function main() {
	return `
		<container class="padding-2 gap-0-5">
			<row class="surface-v1 padding-2 flex-row justify-content-space-between align-items-center">
				<row class="flex-row gap-0-5 width-auto align-items-center justify-content-flex-start">
					<x-link go="history:back" class="btn btn-primary"><x-svg name="arrow_back_v1" color="white"></x-svg></x-link>
					<p>DB.log_in_records.*</p>
				</row>

				<row class="flex-row gap-0-5 width-auto align-items-center justify-content-flex-end"></row>
			</row>

			<column class="table width-100"></column>
		</container>
	`;
}

export async function after() {
	DOM.build("column.table", async function build_log_in_records_HTML() {
		let log_in_records = await window.x.Request.make({ payload: {for: "get_all_log_in_records"} });

		if (log_in_records["type"] != "success") return `<p class="surface-${log_in_records["type"]} width-100 padding-1 text-size-0-8rem">${window.Lang.use(log_in_records["message"])}</p>`;
		else if ("data" in log_in_records) log_in_records = log_in_records["data"];
		else return `<p class="surface-info width-100 padding-1 text-size-0-8rem">${Lang.use("no_data")}</p>`;


		return window.x.Table.build(
			{
				"id": "log_in_records",
				"page_size": 10,
				"searchable": true,
				"downloadable": true,
				"columns": [
					{ "title": "id" },
					{ "title": "metadata_created_at" },
					{
						"title": "user",
						"formatter": (cell) => cell["value"] === null ? '-' : `<a href="/x/user/${cell["value"]}" class="text-decoration-underline">${cell["value"]}</a>`
					},
					{ "title": "IP_address" },
					{ "title": "user_agent" },
					{ "title": "message"}
				],
				"rows": build_table_rows()
			},
			"width-100"
		);

		function build_table_rows() {
			const ROWS = [];

			for (const log_in_record of log_in_records) ROWS.push({
				"id": log_in_record["id"],

				// "user" is NULL for an unsuccessful attempt
				"classes": log_in_record["user"] === null ? "text-color-error" : '',

				"data": [
					{ "value": log_in_record["id"] },
					{ "value": log_in_record["metadata_created_at"] },
					{ "value": log_in_record["user"] },
					{ "value": log_in_record["IP_address"] },
					{ "value": log_in_record["user_agent"] },
					{ "value": log_in_record["message"] }
				]
			});

			return ROWS;
		}
	}, {method: "replaceChildren"});
}
