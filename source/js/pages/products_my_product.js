export const TITLE = window.Lang.use("product");

let product = null;
let productVariants = null;
let productDetails = null;
let productsDetails = null;

export async function before(){
	///// getProduct
	product = await window.bridge(null, {for: "getProduct"});
	product = product?.["data"]?.["product"];

	// Check If Prodcut Exists
	if(!!product === false) window.location.replace("/products/add");


	///// getProductVariants
	productVariants = await window.bridge(null, {for: "getProductVariants"});
	productVariants = productVariants?.["data"]?.["productVariants"];
	if(!!productVariants === false) productVariants = [];


	///// getProductDetails
	productDetails = await window.bridge(null, {for: "getProductDetails"});
	productDetails = productDetails?.["data"]?.["productDetails"];


	///// getProductsDetails
	productsDetails = await window.bridge(null, {for: "getProductsDetails"});
	productsDetails = productsDetails?.["data"]?.["productsDetails"];

	// Check If productsDetails is False
	if(!!productsDetails === false) productsDetails = [];
}

export default function content(){
	return `
		<container class="p-5">
			<column class="w-100 gap-1">
				${overviewHTML()}
				${detailsHTML()}
				${variantsHTML()}
			</column>
		</container>
	`;
}




function overviewHTML(){
	return `
		<form action="/products/my/product/${window.Router.currentPage["urlArgs"]["ID"]}" for="updateProduct" class="surface-clean p-5">
			<h1>Overview</h1>

			<label>
				<p for='title'>${window.Lang.use("title")}</p>
				<input type='text' name='title' value="${product['title']}">
			</label>

			<label>
				<p for='manufacturer'>${window.Lang.use("manufacturer")}</p>
				<input type='text' name='manufacturer' value="${product['manufacturer']}">
			</label>

			<label>
				<p for='description'>${window.Lang.use("description")}</p>
				<textarea name="description" rows="5">${product['description']}</textarea>
			</label>

			<label>
				<input type='checkbox' name='searchable' ${product['searchable'] ? "checked" : ""}>
				<p for='searchable'>${window.Lang.use("searchable")}</p>
			</label>

			<label>
				<input class="btn btn-primary" type='submit' name='updateProduct' value='${window.Lang.use("save")}'>
				<p for='updateProduct'></p>
			</label>
		</form>
	`;
}




function detailsHTML(){
	return `
		<column class="d-flex surface-clean p-5 w-100 gap-1">

			<h1>Details</h1>

			<row class="flex-wrap gap-1">${constructDeleteDetailFomrs()}</row>


			<form action="/products/my/product/${window.Router.currentPage["urlArgs"]["ID"]}" for="addDetail">

				<label>
					<p for='detail'></p>
					<select name="detail">
						<option selected disabled>${window.Lang.use("chooseOption")}</option>
						${constructDetailsFormSelectOprions()}
					</select>
				</label>

				<label>
					<input class="btn btn-primary" type='submit' name='addDetail' value='${window.Lang.use("save")}'>
					<p for='addDetail'></p>
				</label>

			</form>
		</column>
	`;
}

function constructDeleteDetailFomrs(){
	let forms = "";

	for(const assignedDetail of productsDetails)
		forms += `
			<form action="/products/my/product/${window.Router.currentPage["urlArgs"]["ID"]}" for="deleteDetail" class="w-auto">
				<input type="hidden" name="name" value="${assignedDetail["name"]}">
				<button type="submit" name="deleteDetail" class="btn btn-primary d-flex flex-row flex-y-center flex-x-between gap-0-5">
					${window.Lang.use(assignedDetail["name"])}
					<x-icon name="x" color="white"></x-icon>
				</button>
			</form>
		`;

	return forms;
}

function constructDetailsFormSelectOprions(){
	let detailsOptions = "";

	for(const detail of productDetails){
		let assigned = false;

		for(const assignedDetail of productsDetails)
			if(assignedDetail.name == detail.name) assigned = true;

		if(assigned === false) detailsOptions += `<option value="${detail["name"]}">${window.Lang.use(detail["name"])}</option>`;
	}

  	return detailsOptions;
}




function variantsHTML(){
	return `
		<column class="surface-clean p-5 w-100 gap-1">

			<h1>Variants</h1>

			<form action="/products/my/product/${window.Router.currentPage["urlArgs"]["ID"]}" for="addVariant" class="w-auto">
				<button class="btn btn-primary" name="addVariant">${window.Lang.use("addVariant")}</button>
			</form>

			<table class="x-skeleton">
				<thead>
					<tr>
						<th>&#8470;</th>
						<th>${window.Lang.use("timestamp")}</th>
						<th>${window.Lang.use("actions")}</th>
					</tr>
				</thead>
				<tbody>${constructVariantModals()}</tbody>
			</table>

		</column>
	`;
}

function constructVariantModals(){
	let HTML = "";
	let counter = 0;

	for(const variant of productVariants)
		HTML += `
			<tr>
				<td>${++counter}</td>

				<td>${variant["timestamp"]}</td>

				<td>
					<row class="gap-1">

						<column>
							<x-modal trigger="click" type="icon" icon-color="white" value="vertical_dots" button>
								<form action="/products/my/product/${window.Router.currentPage["urlArgs"]["ID"]}" for="updateVariant" class="p-5">

									${constructVariantDetails()}

									<label>
										<p for="title">${window.Lang.use("price")}</p>
										<input type="number" name="price" value="${variant["price"]}">
									</label>

									<label>
										<p for="title">${window.Lang.use("quantity")}</p>
										<input type="number" name="quantity" value="${variant["quantity"]}">
									</label>

									<label>
										<input class="btn btn-primary" type="submit" name="save" value='${window.Lang.use("save")}'>
										<p for="updateVariant"></p>
									</label>

								</form>
							</x-modal>
						</column>

						<form action="/products/my/product/${window.Router.currentPage["urlArgs"]["ID"]}" for="deleteVariant" class="flex-column w-auto">
							<input type="hidden" name="id" value="${variant["id"]}">
							<button type="submit" name='deleteVariant' class="btn btn-primary"><x-icon color="white" name="trash"></x-icon></button>
						</form>

					</row>
				</td>
			</tr>
		`;

	return HTML;
}

function constructVariantDetails(){
	let HTML = "";

	for(const detail of productsDetails)
		HTML += `
			<label>
				<p for='${detail['name']}'>${window.Lang.use(detail['name'])}</p>
				<input type='text' name='${detail['name']}'>
			</label>
		`;

	return HTML;
}
