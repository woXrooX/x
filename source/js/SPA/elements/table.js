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


		// Sortable column IDs
		this.sortable_column_ids = [];
		this.last_sorted_column_id = null;
		this.last_sort_mode = null;

		this.page_size = 10;
		this.current_page = 1;

		// Encoded columns info holder
		this.encoded_columns = [];


		// Init table
		this.#init();

		this.#listen_to_the_sort_clicks();
	}

	#init = ()=>{
		this.innerHTML = `
			<main class="d-flex flex-column gap-0-5">

				<row class="flex-row flex-y-center flex-x-between gap-0-5">
					<column class="w-auto">
						<select>
							<option selected disabled>${this.page_size}</option>
							<option value="10">10</option>
							<option value="15">15</option>
							<option value="20">20</option>
							<option value="25">25</option>
							<option value="50">50</option>
							<option value="100">100</option>
							<option value="all">${window.Lang.use("all")}</option>
						</select>
					</column>
					<column class="w-100">${!!this.JSON?.searchable === true ? '<input type="text">' : ""}</column>
				</row>

				<div for="table"></div>

				<div for="pagination_container" class="d-flex flex-row flex-x-between">
					<div for="showing_counter" class="d-flex flex-row flex-x-start flex-y-center text-size-0-8"></div>
					<div for="pagination" class="d-flex flex-row flex-x-end gap-0-2"></div>
				</div>

			</main>
		`;


		this.#listen_to_page_size_select();

		this.#listen_to_search_typing();

		this.#build_table();

		this.#build_page_buttons();
	}

	#build_table = ()=>{
		this.querySelector("main > div[for=table]").innerHTML = `
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
						<row class="cursor-pointer gap-0-5 flex-y-center flex-x-start">
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

		loop_row: for(const row of this.JSON["body"])
			loop_cell: for(const cell of row)
				if(typeof cell === "string" && cell.toLowerCase().includes(VALUE_LOWER_CASE)){
					this.body_values.push(row);
					break loop_cell;
				}else if(String(cell).toLowerCase().includes(VALUE_LOWER_CASE)){
					this.body_values.push(row);
					break loop_cell;
				}

		console.log(this.body_values);

		if(this.body_values.length === 0) this.body_values = [[window.Lang.use("no_matches")]];
	}

	// Divide data to chunks aka pages
	#divide_data_into_chunks = ()=>{
		// Empty the chunks
		this.body_values_in_chunks = [];

		for(let i = 0; i < this.body_values.length; i += this.page_size)
			this.body_values_in_chunks.push(this.body_values.slice(i, i + this.page_size));
	}

	///////////// Search input
	#listen_to_search_typing = ()=>{
		this.querySelector("main > row > column > input").oninput = ()=>{
			if(event.target.value == ""){
				this.body_values = this.JSON["body"];
				this.#build_body();
				return;
			}
			this.#sort_by_value(event.target.value);
			this.#build_body();
		}
	}

	///////////// Pagination
	#listen_to_page_size_select = ()=>{
		this.querySelector("main > row > column > select").onchange = ()=>{
			const selectedPageSize = event.target.value;

			// If not a number then show all
			if(isNaN(selectedPageSize)) this.page_size = this.JSON["body"].length;

			// Else set page size to the selected
			else this.page_size = parseInt(selectedPageSize);

			// Reset "current_page" to 1
			this.current_page = 1;

			// Update and build the body
			this.#build_body();

			// Update and build the page buttons
			this.#build_page_buttons();
		}
	}

	#build_showing_counter = ()=>{
		this.querySelector("main > div[for=pagination_container]:last-child > div[for=showing_counter]").innerHTML = `
			Page ${this.current_page} of ${this.body_values_in_chunks.length}
		`;
	}

	#build_page_buttons = ()=>{
		this.#build_showing_counter();

		let buttonsHTML = "";

		for(let i = 1; i <= this.body_values_in_chunks.length; i++) buttonsHTML += `<button class="btn btn-primary btn-s d-none" name="${i}">${i}</button>`;

		this.querySelector("main > div[for=pagination_container]:last-child > div[for=pagination]").innerHTML = `
			<button class="btn btn-primary btn-s text-transform-uppercase" name="first">${window.Lang.use("first")}</button>
			<button class="btn btn-primary btn-s" name="previous"><x-svg name="arrow_back" color="white"></x-svg></button>
			<section class="d-flex flex-row gap-0-2">${buttonsHTML}</section>
			<button class="btn btn-primary btn-s" name="next"><x-svg name="arrow_forward" color="white"></x-svg></button>
			<button class="btn btn-primary btn-s text-transform-uppercase" name="last">${window.Lang.use("last")}</button>
		`;

		this.firstButton = this.querySelector(`main > div[for=pagination_container]:last-child > div[for="pagination"] > button[name=first]`);
		this.previousButton = this.querySelector(`main > div[for=pagination_container]:last-child > div[for="pagination"] > button[name=previous]`);
		this.nextButton = this.querySelector(`main > div[for=pagination_container]:last-child > div[for=pagination] > button[name=next]`);
		this.lastButton = this.querySelector(`main > div[for=pagination_container]:last-child > div[for="pagination"] > button[name=last]`);

		this.#update_buttons(this.current_page);
		this.#listen_to_page_buttons_clicks();
	}

	#hide_buttons = ()=>{
		const buttons = this.querySelectorAll("main > div[for=pagination_container]:last-child > div[for=pagination] > section > button");

		for(const button of buttons) button.classList.add("d-none");
	}

	#update_buttons = (id)=>{
		// First hide buttons
		this.#hide_buttons();

		//// Enable/Disable main buttons
		// Enable/Disable "first" button
		if(id == 1) this.firstButton.disabled = true;
		else this.firstButton.disabled = false;

		// Enable/Disable "previous" button
		if(id > 1) this.previousButton.disabled = false;
		else this.previousButton.disabled = true;

		// Enable/Disable "next" button
		if(id == this.body_values_in_chunks.length) this.nextButton.disabled = true;
		else this.nextButton.disabled = false;

		// Enable/Disable "last" button
		if(id == this.body_values_in_chunks.length) this.lastButton.disabled = true;
		else this.lastButton.disabled = false;


		const buttons = [
			this.querySelector(`main > div[for=pagination_container]:last-child > div[for=pagination] > section > button:nth-child(${id-1})`),
			this.querySelector(`main > div[for=pagination_container]:last-child > div[for=pagination] > section > button:nth-child(${id})`),
			this.querySelector(`main > div[for=pagination_container]:last-child > div[for=pagination] > section > button:nth-child(${id+1})`)
		];

		for(const button of buttons) button?.classList.remove("d-none", "disabled", "text-decoration-underline");

		// Current
		buttons[1]?.classList.add("disabled");
		buttons[1]?.classList.add("text-decoration-underline");

		// Update body after current page changes
		this.#build_body();

		// Update showing counter
		this.#build_showing_counter();
	}

	#listen_to_page_buttons_clicks = ()=>{
		// first
		this.firstButton.onclick = ()=> this.#update_buttons((this.current_page = 1));

		// previous
		this.previousButton.onclick = ()=> this.#update_buttons(--this.current_page);

		// next
		this.nextButton.onclick = ()=> this.#update_buttons(++this.current_page);

		// last
		this.lastButton.onclick = ()=> this.#update_buttons((this.current_page = this.body_values_in_chunks.length));

		// 1 to this.body_values_in_chunks.length
		const buttons = this.querySelectorAll("main > div[for=pagination_container]:last-child > div[for=pagination] > section > button");

		for(const button of buttons) button.onclick = ()=> this.#update_buttons((this.current_page = parseInt(button.name)));
	}
};

window.customElements.define('x-table', Table);
window.x["Table"] = Table;
