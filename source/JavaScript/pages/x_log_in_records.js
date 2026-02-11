import String_to_Element from "/JavaScript/modules/parser/String_to_Element.js";

export function before() {
	window.x.Head.set_title("log_in_records");
}

export default async function main() {
	return `
		<container class="padding-5 gap-0-5 max-width-1200px">
			<row class="surface-v1 padding-2 flex-row flex-x-between flex-y-center">
				<row class="flex-row gap-0-5 width-auto flex-y-center flex-x-start">
					<x-link go="history:back" class="btn btn-primary"><x-svg name="arrow_back_v1" color="white"></x-svg></x-link>
					<p>db.log_in_records.*</p>
				</row>

				<row class="flex-row gap-0-5 width-auto flex-y-center flex-x-end"></row>
			</row>

			<column class="table width-100"></column>
		</container>
	`;
}

export async function after() {
	DOM.build("column.table", async function build_log_in_records_HTML() {
		let log_in_records = await window.x.Request.make({for:"get_all_log_in_records"});
		if (log_in_records["type"] === "info") return String_to_Element(`<p class="surface-info width-100 padding-2">${Lang.use(log_in_records["message"])}</p>`);
		if (!("data" in log_in_records)) return String_to_Element(`<p class="width-100 text-size-0-8 surface-warning padding-1">${Lang.use("invalid_response")}</p>`);

		const HEAD = [];
		for (const KEY of Object.keys(log_in_records.data[0])) HEAD.push({"title": KEY});

		const BODY = [];
		for (const i in log_in_records.data) BODY.push(Object.values(log_in_records.data[i]))

		return window.x.Table.build(
			{
				"page_size": 10,
				"searchable": true,
				"downloadable": true,
				"columns": HEAD,
				"rows": BODY
			},
			"surface-v1 width-100 padding-2"
		);
	}, {method: "replaceChildren"});
}
