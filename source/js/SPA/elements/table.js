export default class Table extends HTMLElement{
	static #sort_modes = Object.freeze({ASC: 1, DESC: 2});

	constructor(){
		super();

		// Save the JSON data
		this.JSON = JSON.parse(this.innerHTML).constructor === Object ? JSON.parse(this.innerHTML) : {};

		// Check if body values exists
		if(!("body" in this.JSON)) return;
		this.body_values = this.JSON["body"];
		this.body_values_in_chunks = [];
		this.matched_rows_count = 0;


		// Sortable column IDs
		this.sortable_column_ids = [];
		this.last_sorted_column_id = null;
		this.last_sort_mode = null;

		this.page_size = "page_size" in this.JSON ? this.JSON["page_size"] : 10;
		this.current_page = 1;

		// Encoded columns info holder
		this.encoded_columns = [];


		// Init table
		this.#init();

		this.#listen_to_the_sort_clicks();
	}

	#init = ()=>{
		this.#set_initial_page_size();

		this.innerHTML = `
			<container class="gap-0-5">

				<header class="d-flex flex-row flex-y-center flex-x-between gap-0-5 w-100">
					<select class="w-auto text-align-center">
						<option selected disabled>${this.page_size}</option>
						<option value="10">10</option>
						<option value="15">15</option>
						<option value="20">20</option>
						<option value="25">25</option>
						<option value="50">50</option>
						<option value="100">100</option>
						<option value="all">${window.Lang.use("all")}</option>
					</select>

					<column class="w-100">${!!this.JSON?.searchable === true ? '<input type="text" class="w-100">' : ""}</column>
				</header>

				<main class="scrollbar-x scrollbar-y w-100" style="max-height: calc(90vh - var(--header-height) * 4)"></main>

				<footer class="d-flex flex-row s-flex-column flex-x-between gap-1 w-100">
					<section class="d-flex flex-row flex-x-start flex-y-center gap-0-5 text-size-0-8">
						<span class="page_numbers"></span>
						<span class="total_rows"></span>
						<span class="matched_rows"></span>
					</section>

					<section class="d-flex flex-row flex-x-end gap-0-2"></section>
				</footer>

			</container>
		`;


		this.#listen_to_page_size_select();

		this.#listen_to_search_typing();

		this.#build_table();

		this.#build_total_rows_HTML();

		this.#build_page_buttons_HTML();
	}


	//////////////////////////// Header
	#listen_to_page_size_select = ()=>{
		this.querySelector("container > header > select").onchange = ()=>{
			const selected_page_size = event.target.value;

			// If not a number then show all
			if(isNaN(selected_page_size)) this.page_size = this.JSON["body"].length;

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
		this.querySelector("container > header > column > input").oninput = ()=>{
			// Fixes issues when you are on page N and the search generated page numbers are less than N
			this.#update_buttons((this.current_page = 1));

			if(event.target.value == ""){
				this.body_values = this.JSON["body"];
				this.#build_body();
				this.querySelector("container > footer > section:nth-child(1) > span.matched_rows").innerHTML = '';
				this.#build_page_buttons_HTML();
				return;
			}

			this.#sort_by_value(event.target.value);
			this.#build_body();
			this.#build_page_buttons_HTML();
			this.#build_matched_rows_HTML();
		}
	}





	//////////////////////////// Main
	#build_table = ()=>{
		this.querySelector("container > main").innerHTML = `
			<table class="${this.getAttribute("class") || ""}">
				<thead><tr></tr></thead>
				<tbody></tbody>
				<tfoot><tr></tr></tfoot>
			</table>
		`;

		this.#build_head();
		this.#build_body();
		this.#build_foot();
	}

	#build_head = ()=>{
		if(!("head" in this.JSON)) return;
		let HTML = "";

		for (let index = 0; index < this.JSON["head"].length; index++){
			if(!("title" in this.JSON["head"][index])) return "Invalid head data";

			// Check if sortable
			if("sortable" in this.JSON["head"][index] && this.JSON["head"][index]["sortable"] === true){
				// Save sortable column ID
				this.sortable_column_ids.push(index);

				// Create sort icon
				HTML += `
					<th>
						<row class="cursor-pointer gap-0-5 flex-row flex-y-center flex-x-start">
							${this.JSON["head"][index]["title"]}
							<x-svg name="sort_ASC" toggle="sort_DESC"></x-svg>
						</row>
					</th>
				`;
			}

			// Just title
			else HTML += `<th>${this.JSON["head"][index]["title"]}</th>`;

			// Check if this column is encoded
			if("encoded" in this.JSON["head"][index] && this.JSON["head"][index]["encoded"] === true) this.encoded_columns.push(true);
			else this.encoded_columns.push(false);
		}

		this.querySelector("table > thead > tr").innerHTML = HTML;
	}

	#build_body = ()=>{
		let HTML = "";

		this.#divide_data_into_chunks();

		if(this.body_values_in_chunks.length === 0){
			this.querySelector("table > tbody").innerHTML = `<tr><td>${window.Lang.use("no_data")}</td></tr>`;
			return;
		}

		for(const row of this.body_values_in_chunks[this.current_page-1]){
			HTML += "<tr>";

			for(let index = 0; index < row.length; index++)
				if(this.encoded_columns[index] === true) HTML += `<td>${decodeURIComponent(row[index])}</td>`;
				else HTML += `<td>${row[index]}</td>`;

			HTML += "</tr>";
		}

		this.querySelector("table > tbody").innerHTML = HTML;
	}

	#build_foot = ()=>{
		if(!("foot" in this.JSON)) return;
		let HTML = "";
		for(const cell of this.JSON["foot"]) HTML += `<td>${cell}</td>`;

		this.querySelector("table > tfoot > tr").innerHTML = HTML;
	}

	////////////// Helper
	////////// Sort
	#listen_to_the_sort_clicks = ()=>{
		for(const id of this.sortable_column_ids){
			const th_element = this.querySelector(`table > thead > tr > th:nth-child(${id+1})`);

			th_element.onclick = ()=>{
				// Update last sorted column ID with the current clicked column ID
				this.last_sorted_column_id = id;

				th_element.querySelector("row > x-svg").forceToggle();

				switch(this.last_sort_mode){
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
			// Numerical comparison
			if(!isNaN(a[this.last_sorted_column_id]) && !isNaN(b[this.last_sorted_column_id]))
			return a[this.last_sorted_column_id] - b[this.last_sorted_column_id];

			// String comparison
			else return a[this.last_sorted_column_id].localeCompare(b[this.last_sorted_column_id]);
		});
	}

  	// Sort algo DESC
	#sort_DESC = ()=>{
		this.body_values.sort((a, b)=>{
			// Numerical comparison
			if(!isNaN(a[this.last_sorted_column_id]) && !isNaN(b[this.last_sorted_column_id]))
				return b[this.last_sorted_column_id] - a[this.last_sorted_column_id];

			// String comparison
			else return b[this.last_sorted_column_id].localeCompare(a[this.last_sorted_column_id]);
		});
	}

	#sort_by_value = (value)=>{
		this.body_values = [];

		const VALUE_LOWER_CASE = value.toLowerCase();

		match_by_value_by_column: {
			const title_and_value = VALUE_LOWER_CASE.match(/^(.*?):(.*)$/);
			if(title_and_value === null) break match_by_value_by_column;

			const title = title_and_value[1];
			const value = title_and_value[2];

			let matched_title_index = null;

			// Getting the index of an title in this.JSON["head"] that contains the "title"
			loop_columns: for(let i = 0; i < this.JSON["head"].length; i++)
				if(this.JSON["head"][i]["title"].toLowerCase().includes(title)){
					matched_title_index = i;
					break loop_columns;
				}

			if(matched_title_index === null) break match_by_value_by_column;

			for(const row of this.JSON["body"])
				if(typeof row[matched_title_index] === "string" && row[matched_title_index].toLowerCase().includes(value)) this.body_values.push(row);
				else if(String(row[matched_title_index]).toLowerCase().includes(value)) this.body_values.push(row);
		}

		match_by_value_to_cells: {
			loop_rows: for(const row of this.JSON["body"])
				loop_cells: for(const cell of row)
					if(typeof cell === "string" && cell.toLowerCase().includes(VALUE_LOWER_CASE)){
						this.body_values.push(row);
						break loop_cells;
					}else if(String(cell).toLowerCase().includes(VALUE_LOWER_CASE)){
						this.body_values.push(row);
						break loop_cells;
					}
		}

		this.matched_rows_count = this.body_values.length;
		if(this.body_values.length === 0) this.body_values = [[window.Lang.use("no_matches")]];
	}

	// Divide data to chunks aka pages
	#divide_data_into_chunks = ()=>{
		// Empty the chunks
		this.body_values_in_chunks = [];

		for(let i = 0; i < this.body_values.length; i += this.page_size)
			this.body_values_in_chunks.push(this.body_values.slice(i, i + this.page_size));
	}

	#set_initial_page_size = () => {
		if(this.page_size === "all") return this.page_size = this.JSON["body"].length;

		if(isNaN(parseInt(this.page_size))) return this.page_size = 10;

		if(parseInt(this.page_size) < 0 || parseInt(this.page_size) == 0) return this.page_size = 10;

		if(parseInt(this.page_size) > this.JSON["body"].length) return this.page_size = this.JSON["body"].length;

		return this.page_size = parseInt(this.page_size);
	}




	//////////////////////////// Footer
	#build_page_numbers_HTML = ()=>{
		this.querySelector("container > footer > section:nth-child(1) > span.page_numbers").innerHTML = `
			<span class="text-color-secondary text-size-0-7">Page</span>
			${this.current_page}
			<span class="text-color-secondary text-size-0-7">of</span>
			${this.body_values_in_chunks.length}
		`;
	}

	#build_total_rows_HTML = ()=>{this.querySelector("container > footer > section:nth-child(1) > span.total_rows").innerHTML = `<span class="text-color-secondary text-size-0-7">Total rows:</span> ${this.JSON["body"].length}`;}

	#build_matched_rows_HTML = ()=>{this.querySelector("container > footer > section:nth-child(1) > span.matched_rows").innerHTML = `<span class="text-color-secondary text-size-0-7">Matched rows:</span> ${this.matched_rows_count}`;}





	////////////// container > footer > section:nth-child(2)
	#build_page_buttons_HTML = ()=>{
		let buttons_HTML = "";

		for(let i = 1; i <= this.body_values_in_chunks.length; i++) buttons_HTML += `<button class="btn btn-primary btn-s d-none" name="${i}">${i}</button>`;

		this.querySelector("container > footer > section:nth-child(2)").innerHTML = `
			<button class="btn btn-primary btn-s text-transform-uppercase" name="first">${window.Lang.use("first")}</button>
			<button class="btn btn-primary btn-s" name="previous"><x-svg name="arrow_back" color="white"></x-svg></button>
			<section class="d-flex flex-row gap-0-2">${buttons_HTML}</section>
			<button class="btn btn-primary btn-s" name="next"><x-svg name="arrow_forward" color="white"></x-svg></button>
			<button class="btn btn-primary btn-s text-transform-uppercase" name="last">${window.Lang.use("last")}</button>
		`;

		this.first_button = this.querySelector(`container > footer > section:nth-child(2) > button[name=first]`);
		this.previous_button = this.querySelector(`container > footer > section:nth-child(2) > button[name=previous]`);
		this.next_button = this.querySelector(`container > footer > section:nth-child(2) > button[name=next]`);
		this.last_button = this.querySelector(`container > footer > section:nth-child(2) > button[name=last]`);

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

		for(const button of buttons) button.onclick = ()=> this.#update_buttons((this.current_page = parseInt(button.name)));
	}

	#hide_buttons = ()=>{
		const buttons = this.querySelectorAll("container > footer > section:nth-child(2) > section > button");

		for(const button of buttons) button.classList.add("d-none");
	}

	#update_buttons = (id)=>{
		// First hide buttons
		this.#hide_buttons();

		//// Enable/Disable main buttons
		// Enable/Disable "first" button
		if(id == 1) this.first_button.disabled = true;
		else this.first_button.disabled = false;

		// Enable/Disable "previous" button
		if(id > 1) this.previous_button.disabled = false;
		else this.previous_button.disabled = true;

		// Enable/Disable "next" button
		if(id == this.body_values_in_chunks.length) this.next_button.disabled = true;
		else this.next_button.disabled = false;

		// Enable/Disable "last" button
		if(id == this.body_values_in_chunks.length) this.last_button.disabled = true;
		else this.last_button.disabled = false;


		const buttons = [
			this.querySelector(`container > footer > section:nth-child(2) > section > button:nth-child(${id-1})`),
			this.querySelector(`container > footer > section:nth-child(2) > section > button:nth-child(${id})`),
			this.querySelector(`container > footer > section:nth-child(2) > section > button:nth-child(${id+1})`)
		];

		for(const button of buttons) button?.classList.remove("d-none", "disabled", "text-decoration-underline");

		// Current
		buttons[1]?.classList.add("disabled");
		buttons[1]?.classList.add("text-decoration-underline");

		// Update body after current page changes
		this.#build_body();

		// Update page numbers
		this.#build_page_numbers_HTML();
	}




};

window.customElements.define('x-table', Table);
window.x["Table"] = Table;
