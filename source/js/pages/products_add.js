export const TITLE = window.Lang.use("createProduct");

export default function content(){

	return `
		<container class="p-5">
			<form action="/products/add" for="createProduct" class="surface-clean p-5 w-50">

				<label>
					<p for='title'>${window.Lang.use("title")}</p>
					<input type='text' name='title'>
				</label>

				<label>
					<p for='manufacturer'>${window.Lang.use("manufacturer")}</p>
					<input type='text' name='manufacturer'>
				</label>

				<label>
					<p for='description'>${window.Lang.use("description")}</p>
					<textarea name="description" rows="5"></textarea>
				</label>

				<label>
					<input type='checkbox' name='searchable'>
					<p for='searchable'>${window.Lang.use("searchable")}</p>
				</label>

				<label>
					<input class="btn btn-primary" type='submit' name='createProduct' value='${window.Lang.use("createProduct")}'>
					<p for='createProduct'></p>
				</label>

			</form>
		</container>
	`;
}
