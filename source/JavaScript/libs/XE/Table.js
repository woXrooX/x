export default class Table extends HTMLElement {
	/////////////////////////// Static

	static #sort_modes = Object.freeze({ASC: 1, DESC: 2});

	/////////// APIs

	static build(JSON, classes = null) {
		const table = document.createElement("x-table");

		if (typeof(classes) === "string") table.classList.add(...classes.trim().split(/\s+/));

		table.JSON = JSON;

		return table;
	}


	/////////////////////////// Object

	#JSON = false;
	#is_initialized = false;
	#lazy_draw_batch_size = 100;
	#lazy_draw_next_batch_index = 0;
	#lazy_draw_observer = null;
	#lazy_draw_loader_element = null;
	#body_tds = [];



	/////////// APIs

	constructor() {
		super();
	}

	connectedCallback() {
		this.#init_core();
	}

	disconnectedCallback() {
		this.#lazy_draw_observer?.disconnect();
		this.#lazy_draw_observer = null;
	}

	set JSON(value) {
		if (this.#is_initialized === true) return;

		if (
			value === null ||
			typeof(value) !== "object" ||
			Array.isArray(value)
		) throw new TypeError("Table: data must be a plain object (JSON object).");

		this.#JSON = value;
	}


	/////////// Helpers

	#init_core = () => {
		if (this.#is_initialized === true) return;
		this.#is_initialized = true;

		if (this.#JSON === false) {
			try { this.#JSON = JSON.parse(this.textContent); }
			catch(error) { throw new TypeError("Table: Not JSON-able content."); }

			this.replaceChildren();
		}

		// Check if body values exists
		if (!("body" in this.#JSON)) return;

		this.#convert_body_to_tds();

		this.body_values = this.#body_tds;
		this.body_values_in_chunks = [];
		this.matched_rows_count = 0;

		// Sortable column IDs
		this.sortable_column_ids = [];
		this.last_sorted_column_id = null;
		this.last_sort_mode = null;

		this.page_size = "page_size" in this.#JSON ? this.#JSON["page_size"] : 10;
		this.current_page = 1;

		// Init table
		this.#set_up_table();

		this.#listen_to_the_sort_clicks();
	}


	#convert_body_to_tds = () => {
		this.#body_tds = [];

		for (const row of this.#JSON["body"]) {
			const td_row = [];

			for (const cell_value of row) {
				const td = document.createElement("td");
				td.innerHTML = cell_value;
				td_row.push(td);
			}

			this.#body_tds.push(td_row);
		}
	}


	//////// Table

	#set_up_table = ()=>{
		this.#set_initial_page_size();

		this.innerHTML = `
			<container class="gap-0-5">

				<header class="display-flex flex-row flex-y-center flex-x-between gap-0-5 width-100">
					<select
						class="
							text-align-center
							width-auto
							min-width-75px
							box-shadow-v0
						"
						style="outline-offset: -1px;"
					>
						<option selected disabled>${this.page_size}</option>
						<option value="10">10</option>
						<option value="15">15</option>
						<option value="20">20</option>
						<option value="25">25</option>
						<option value="50">50</option>
						<option value="100">100</option>
						<option value="all">${window.Lang.use("all")}</option>
					</select>

					<column class="width-100">
						${
							!!this.#JSON?.searchable === true ?
							`<input
								type="text"
								placeholder="${Lang.use("type_to_search")}"
								class="
									width-100
									box-shadow-v0
								"
								style="outline-offset: -1px;"
							>` :
							''
						}
					</column>
				</header>

				<main class="width-100"></main>

				<footer class="display-flex flex-row s-flex-column flex-x-between gap-1 width-100">
					<section class="display-flex flex-row flex-x-start flex-y-center gap-0-5 text-size-0-8">
						<span class="page_numbers"></span>
						<span class="total_rows"></span>
						<span class="matched_rows"></span>
					</section>

					<section class="display-flex flex-row flex-x-end gap-0-2"></section>
				</footer>

			</container>
		`;

		this.#listen_to_page_size_select();

		this.#listen_to_search_typing();

		this.#build_table();

		this.#build_total_rows_HTML();

		this.#build_page_buttons_HTML();
	}

	//// Header

	#listen_to_page_size_select = ()=>{
		this.querySelector("container > header > select").onchange = (event)=>{
			const selected_page_size = event.target.value;

			if (isNaN(selected_page_size)) this.page_size = this.#body_tds.length;

			// Else set page size to the selected
			else this.page_size = parseInt(selected_page_size);

			// Reset "current_page" to 1
			this.current_page = 1;

			// Update and build the body
			this.#build_body();

			// Update and build the page buttons
			this.#build_page_buttons_HTML();
		}
	}

	#listen_to_search_typing = ()=>{
		let debounce_timeout;
		this.querySelector("container > header > column > input").oninput = (event)=>{
			clearTimeout(debounce_timeout);

			debounce_timeout = setTimeout(() => {
				// Fixes issues when you are on page N and the search generated page numbers are less than N
				this.#update_buttons((this.current_page = 1));

				if (event.target.value == "") {
					this.body_values = this.#body_tds;
					this.#build_body();
					this.querySelector("container > footer > section:nth-child(1) > span.matched_rows").innerHTML = '';
					this.#build_page_buttons_HTML();
					return;
				}

				this.#find_matches(event.target.value);
				this.#build_body();
				this.#build_page_buttons_HTML();
				this.#build_matched_rows_HTML();

			}, 500);
		}
	}


	//// Main

	#build_table = ()=>{
		this.querySelector("container > main").innerHTML = `
			<section class="table-container table-thead-sticky scrollbar-x">
				<table>
					<thead><tr></tr></thead>
					<tbody></tbody>
					<tfoot><tr></tr></tfoot>
				</table>
			</section>
		`;

		this.#build_head();
		this.#build_body();
		this.#build_foot();
	}

	#build_head = ()=>{
		if (!("head" in this.#JSON)) return;
		let HTML = "";

		for (let index = 0; index < this.#JSON["head"].length; index++) {
			if (!("title" in this.#JSON["head"][index])) return "Invalid head data";

			// Check if sortable
			if ("sortable" in this.#JSON["head"][index] && this.#JSON["head"][index]["sortable"] === true) {
				// Save sortable column ID
				this.sortable_column_ids.push(index);

				// Create sort icon
				HTML += `
					<th>
						<row class="cursor-pointer gap-0-5 flex-row flex-y-center flex-x-start">
							${this.#JSON["head"][index]["title"]}
							<x-svg name="sort_ASC" toggle="sort_DESC"></x-svg>
						</row>
					</th>
				`;
			}

			// Just title
			else HTML += `<th>${this.#JSON["head"][index]["title"]}</th>`;
		}

		this.querySelector("table > thead > tr").innerHTML = HTML;
	}

	#build_body = ()=>{
		this.#divide_data_into_chunks();
		const rows = this.body_values_in_chunks[this.current_page - 1] ?? [];

		if (rows.length === 0) {
			this.querySelector("table > tbody").innerHTML = `<tr><td>${window.Lang.use("no_data")}</td></tr>`;
			return;
		}

		this.#lazy_draw_next_batch_index = 0;
		this.querySelector("table > tbody").replaceChildren();
		this.#lazy_draw_batch(rows);
		this.#init_observer_lazy_draw(rows);
	}

	#build_foot = ()=>{
		if (!("foot" in this.#JSON)) return;
		let HTML = "";
		for (const cell of this.#JSON["foot"]) HTML += `<td>${cell}</td>`;

		this.querySelector("table > tfoot > tr").innerHTML = HTML;
	}


	//// Lazy draw

	#lazy_draw_batch = (rows)=>{
		let batch_last_index = this.#lazy_draw_next_batch_index + this.#lazy_draw_batch_size;
		if (rows.length < batch_last_index) batch_last_index = rows.length;

		const fragment = document.createDocumentFragment();

		for (let row = this.#lazy_draw_next_batch_index; row < batch_last_index; row++) {
			const tr = document.createElement("tr");
			for (const td of rows[row]) tr.appendChild(td.cloneNode(true));
			fragment.appendChild(tr);
		}

		this.querySelector("table > tbody").appendChild(fragment);

		this.#lazy_draw_next_batch_index = batch_last_index;
	}

	#init_observer_lazy_draw = (rows)=>{
		if (this.#lazy_draw_observer != null) {
			this.#lazy_draw_observer.disconnect();
			this.#lazy_draw_observer = null;
		}

		if (this.#lazy_draw_loader_element == null) {
			this.#lazy_draw_loader_element = document.createElement("tr");
			this.#lazy_draw_loader_element.innerHTML = `<td colspan="1000" class="width-100 height-50px padding-5 loading-on-element loading-on-element-bg-unset"></td>`;
		}

		const tbody = this.querySelector("table > tbody");
		tbody.appendChild(this.#lazy_draw_loader_element);

		this.#lazy_draw_observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting) return;

				this.#lazy_draw_batch(rows);
				tbody.appendChild(this.#lazy_draw_loader_element);

				if (this.#lazy_draw_next_batch_index >= rows.length) {
					this.#lazy_draw_observer.disconnect();
					this.#lazy_draw_loader_element.remove();
				}
			},
			{ root: this.querySelector("main"), rootMargin: "0px", threshold: 0.5 }
		);

		this.#lazy_draw_observer.observe(this.#lazy_draw_loader_element);
	}


	//// Sort

	#listen_to_the_sort_clicks = ()=>{
		for (const id of this.sortable_column_ids) {
			const th_element = this.querySelector(`table > thead > tr > th:nth-child(${id+1})`);

			th_element.onclick = ()=>{
				// Update last sorted column ID with the current clicked column ID
				this.last_sorted_column_id = id;

				th_element.querySelector("row > x-svg").forceToggle();

				switch(this.last_sort_mode) {
				case Table.#sort_modes.ASC:
					this.#sort_DESC();
					this.last_sort_mode = Table.#sort_modes.DESC;
					break;

				case Table.#sort_modes.DESC:
					this.#sort_ASC();
					this.last_sort_mode = Table.#sort_modes.ASC;
					break;

				default:
					this.#sort_ASC();
					this.last_sort_mode = Table.#sort_modes.ASC;
				}

				// Update table view
				this.#build_body();
			};
		}
	}

	// Sort algo ASC
	#sort_ASC = ()=>{
		this.body_values.sort((a, b)=>{
			const a_text = a[this.last_sorted_column_id].innerText;
			const b_text = b[this.last_sorted_column_id].innerText;

			// Numerical comparison
			if (!isNaN(a_text) && !isNaN(b_text)) return Number(a_text) - Number(b_text);

			// String comparison
			else return a_text.localeCompare(b_text);
		});
	}

	// Sort algo DESC
	#sort_DESC = ()=>{
		this.body_values.sort((a, b)=>{
			const a_text = a[this.last_sorted_column_id].innerText;
			const b_text = b[this.last_sorted_column_id].innerText;

			// Numerical comparison
			if (!isNaN(a_text) && !isNaN(b_text)) return Number(b_text) - Number(a_text);

			// String comparison
			else return b_text.localeCompare(a_text);
		});
	}

	#find_matches = (value)=>{
		this.body_values = [];

		const ROWS = [...this.#body_tds];
		const VALUE_LOWER_CASE = value.toLowerCase();

		this.#match_values_by_columns(VALUE_LOWER_CASE, ROWS);
		this.#match_values_by_cells(VALUE_LOWER_CASE, ROWS);

		this.matched_rows_count = this.body_values.length;

		if (this.body_values.length === 0) {
			const no_match_td = document.createElement("td");
			no_match_td.innerText = window.Lang.use("no_matches");
			this.body_values = [[no_match_td]];
		}
	}

	#match_values_by_columns = (VALUE_LOWER_CASE, ROWS)=>{
		const TITLE_AND_VALUE = VALUE_LOWER_CASE.match(/^(.*?):(.*)$/);
		if (TITLE_AND_VALUE === null) return;

		const TITLE = TITLE_AND_VALUE[1];
		const VALUE = TITLE_AND_VALUE[2];

		let matched_title_index = null;

		// Getting the index of an title in this.#JSON["head"] that contains the "title"
		loop_columns: for (let i = 0; i < this.#JSON["head"].length; i++)
			if (this.#JSON["head"][i]["title"].toLowerCase().includes(TITLE)) {
				matched_title_index = i;
				break loop_columns;
			}

		if (matched_title_index === null) return;

		for (const ROW of ROWS) {
			const STRING_CELL = ROW[matched_title_index].innerText;

			if (STRING_CELL.toLowerCase().includes(VALUE)) this.body_values.push(ROW);
		}
	}

	#match_values_by_cells = (VALUE_LOWER_CASE, ROWS)=>{
		for (const ROW of ROWS) {
			let is_anything_in_row_matched = false;

			loop_cells: for (let i = 0; i < ROW.length; i++) {
				let cell_string = ROW[i].innerText;

				if (cell_string.toLowerCase().includes(VALUE_LOWER_CASE)) is_anything_in_row_matched = true;
			}

			if (is_anything_in_row_matched === true) this.body_values.push(ROW);
		}
	}


	// Divide data to chunks aka pages
	#divide_data_into_chunks = ()=>{
		// Empty the chunks
		this.body_values_in_chunks = [];

		for (let i = 0; i < this.body_values.length; i += this.page_size)
			this.body_values_in_chunks.push(this.body_values.slice(i, i + this.page_size));
	}

	#set_initial_page_size = ()=>{
		if (this.page_size === "all") return this.page_size = this.#body_tds.length;

		if (isNaN(parseInt(this.page_size))) return this.page_size = 10;

		if (parseInt(this.page_size) < 0 || parseInt(this.page_size) == 0) return this.page_size = 10;

		if (parseInt(this.page_size) > this.#body_tds.length) return this.page_size = this.#body_tds.length;

		return this.page_size = parseInt(this.page_size);
	}




	//// Footer

	#build_page_numbers_HTML = ()=>{
		this.querySelector("container > footer > section:nth-child(1) > span.page_numbers").innerHTML = `
			<span class="text-color-secondary text-size-0-7">Page</span>
			${this.current_page}
			<span class="text-color-secondary text-size-0-7">of</span>
			${this.body_values_in_chunks.length}
		`;
	}

	#build_total_rows_HTML = ()=>{this.querySelector("container > footer > section:nth-child(1) > span.total_rows").innerHTML = `<span class="text-color-secondary text-size-0-7">Total rows:</span> ${this.#body_tds.length}`;}

	#build_matched_rows_HTML = ()=>{this.querySelector("container > footer > section:nth-child(1) > span.matched_rows").innerHTML = `<span class="text-color-secondary text-size-0-7">Matched rows:</span> ${this.matched_rows_count}`;}





	//// container > footer > section:nth-child(2)

	#build_page_buttons_HTML = ()=>{
		let buttons_HTML = "";

		for (let i = 1; i <= this.body_values_in_chunks.length; i++) buttons_HTML += `<button class="btn btn-primary btn-s display-none" name="${i}">${i}</button>`;

		this.querySelector("container > footer > section:nth-child(2)").innerHTML = `
			<x-svg name="arrow_left_first_page" color="white" class="btn btn-primary btn-s"></x-svg>
			<x-svg name="arrow_back_v1" color="white" class="btn btn-primary btn-s"></x-svg>
			<section class="display-flex flex-row gap-0-2">${buttons_HTML}</section>
			<x-svg name="arrow_forward_v1" color="white" class="btn btn-primary btn-s"></x-svg>
			<x-svg name="arrow_right_last_page" color="white" class="btn btn-primary btn-s"></x-svg>
		`;

		this.first_button = this.querySelector(`container > footer > section:nth-child(2) > x-svg[name=arrow_left_first_page]`);
		this.previous_button = this.querySelector(`container > footer > section:nth-child(2) > x-svg[name=arrow_back_v1]`);
		this.next_button = this.querySelector(`container > footer > section:nth-child(2) > x-svg[name=arrow_forward_v1]`);
		this.last_button = this.querySelector(`container > footer > section:nth-child(2) > x-svg[name=arrow_right_last_page]`);

		this.#update_buttons(this.current_page);
		this.#listen_to_page_buttons_clicks();
	}

	#listen_to_page_buttons_clicks = ()=>{
		// first
		this.first_button.onclick = ()=> this.#update_buttons((this.current_page = 1));

		// previous
		this.previous_button.onclick = ()=> this.#update_buttons(--this.current_page);

		// next
		this.next_button.onclick = ()=> this.#update_buttons(++this.current_page);

		// last
		this.last_button.onclick = ()=> this.#update_buttons((this.current_page = this.body_values_in_chunks.length));

		// 1 to this.body_values_in_chunks.length
		const buttons = this.querySelectorAll("container > footer > section:nth-child(2) > section > button");

		for (const button of buttons) button.onclick = ()=> this.#update_buttons((this.current_page = parseInt(button.name)));
	}

	#hide_buttons = ()=>{
		const buttons = this.querySelectorAll("container > footer > section:nth-child(2) > section > button");

		for (const button of buttons) button.classList.add("display-none");
	}

	#update_buttons = (id)=>{
		// First hide buttons
		this.#hide_buttons();

		//// Enable/Disable main buttons
		// Enable/Disable "first" button
		if (id == 1) this.first_button.classList.add("disabled");
		else this.first_button.classList.remove("disabled");

		// Enable/Disable "previous" button
		if (id > 1) this.previous_button.classList.remove("disabled");
		else this.previous_button.classList.add("disabled");

		// Enable/Disable "next" button
		if (id == this.body_values_in_chunks.length) this.next_button.classList.add("disabled");
		else this.next_button.classList.remove("disabled");

		// Enable/Disable "last" button
		if (id == this.body_values_in_chunks.length) this.last_button.classList.add("disabled");
		else this.last_button.classList.remove("disabled");


		const buttons = [
			this.querySelector(`container > footer > section:nth-child(2) > section > button:nth-child(${id-1})`),
			this.querySelector(`container > footer > section:nth-child(2) > section > button:nth-child(${id})`),
			this.querySelector(`container > footer > section:nth-child(2) > section > button:nth-child(${id+1})`)
		];

		for (const button of buttons) button?.classList.remove("display-none", "disabled", "text-decoration-underline");

		// Current
		buttons[1]?.classList.add("disabled");
		buttons[1]?.classList.add("text-decoration-underline");

		// Update body after current page changes
		this.#build_body();

		// Update page numbers
		this.#build_page_numbers_HTML();
	}
};

window.x["Table"] = Table;

window.customElements.define('x-table', Table);
