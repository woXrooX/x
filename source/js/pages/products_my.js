"use strict";

export async function before(){
	window.pageData.productsHTML = "<tr><td>No records to show.</td></tr>";

	const data = await window.bridge("products/my", {for: "getAllProducts"});

	// If Data Exsits
	if(data?.data?.allProducts?.length > 0){
		window.pageData.productsHTML = "";

		for(const product of data["data"]["allProducts"]){
			window.pageData.productsHTML += "<tr>";

			for(const column in product) window.pageData.productsHTML += `<td>${product[column]}</td>`;

			window.pageData.productsHTML += `
					<td><a href="/products/my/product/${product["id"]}">Open</a></td>
				</tr>
			`;
		}
	}
}

export const TITLE = window.Lang.use("myProducts");

export default function content(){
	return `
		<container class="p-5">
			<column class="surface-clean w-auto p-5 gap-1">
				<h1>${window.Lang.use("myProducts")}</h1>
				<table class="x-clean">
					<thead>
						<tr>
							<th>${window.Lang.use("ID")}</th>
							<th>${window.Lang.use("owner")}</th>
							<th>${window.Lang.use("title")}</th>
							<th>${window.Lang.use("manufacturer")}</th>
							<th>${window.Lang.use("description")}</th>
							<th>${window.Lang.use("searchable")}</th>
							<th>${window.Lang.use("price")}</th>

							<th>${window.Lang.use("last_update")}</th>
							<th>${window.Lang.use("timestamp")}</th>

							<th>${window.Lang.use("action")}</th>
						</tr>
					</thead>
					<tbody>${window.pageData.productsHTML}</tbody>
				</table>
			</column>
		</container>
	`;
}
