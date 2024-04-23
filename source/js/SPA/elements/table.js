// v0.1.1.0
// Uses XUI

export default class Table extends HTMLElement{
	static sortModes = Object.freeze({ASC: 1, DESC: 2});

	constructor(){
		super();

		// Save the JSON data
		this.JSON = JSON.parse(this.innerHTML).constructor === Object ? JSON.parse(this.innerHTML) : {};

		// Check if body values exists
		if(!("body" in this.JSON)) return;
		this.bodyValues = this.JSON["body"];
		this.bodyValuesInChunks = [];


		// Sortable column IDs
		this.sortableColumnIDs = [];
		this.lastSortedColumnID = null;
		this.lastSortMode = null;

		this.pageSize = 10;
		this.currentPage = 1;

		// Encoded columns info holder
		this.encodedColumns = [];


		// Init table
		this.#build();

		this.#listenToTheSortClicks();
	}

	#build = ()=>{
		this.innerHTML = `
			<main class="d-flex flex-column gap-0-5">

				<row class="flex-y-center flex-x-between gap-0-5">
					<column class="w-auto">
						<select>
							<option selected disabled>${this.pageSize}</option>
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

				<div for="paginationContainer" class="d-flex flex-row flex-x-between">
					<div for="showingCounter" class="d-flex flex-row flex-x-start flex-y-center text-size-0-8"></div>
					<div for="pagination" class="d-flex flex-row flex-x-end gap-0-2"></div>
				</div>

			</main>
		`;


		this.#listenToPageSizeSelect();

		this.#listenToSearchTyping();

		this.#buildTable();

		this.#buildPageButtons();
	}

	///////////// Table
	#buildTable = ()=>{
		this.querySelector("main > div[for=table]").innerHTML = `
			<table class="${this.getAttribute("class") || ""}">
				<thead><tr></tr></thead>
				<tbody></tbody>
				<tfoot><tr></tr></tfoot>
			</table>
		`;

		this.#buildHead();
		this.#buildBody();
		this.#buildFoot();
	}

	#buildHead = ()=>{
		if(!("head" in this.JSON)) return;
		let HTML = "";

		for (let index = 0; index < this.JSON["head"].length; index++){
			if(!("title" in this.JSON["head"][index])) return "Invalid head data";

			// Check if sortable
			if("sortable" in this.JSON["head"][index] && this.JSON["head"][index]["sortable"] === true){
				// Save sortable column ID
				this.sortableColumnIDs.push(index);

				// Create sort icon
				HTML += `
					<th>
						<row class="cursor-pointer gap-0-5 flex-y-center">
							${this.JSON["head"][index]["title"]}
							<x-svg color="currentcolor" name="sort_ASC"></x-svg>
						</row>
					</th>
				`;
			}

			// Just title
			else HTML += `<th>${this.JSON["head"][index]["title"]}</th>`;

			// Check if this column is encoded
			if("encoded" in this.JSON["head"][index] && this.JSON["head"][index]["encoded"] === true) this.encodedColumns.push(true);
			else this.encodedColumns.push(false);


		}

		this.querySelector("table > thead > tr").innerHTML = HTML;
	}

	#buildBody = ()=>{
		let HTML = "";

		this.#divideDataIntoChunks();

		if(this.bodyValuesInChunks.length === 0){
			this.querySelector("table > tbody").innerHTML = `<tr><td>${window.Lang.use("noData")}</td></tr>`;
			return;
		}

		for(const row of this.bodyValuesInChunks[this.currentPage-1]){
			HTML += "<tr>";

			for(let index = 0; index < row.length; index++)
				if(this.encodedColumns[index] === true) HTML += `<td>${decodeURIComponent(row[index])}</td>`;
				else HTML += `<td>${row[index]}</td>`;

			HTML += "</tr>";
		}

		this.querySelector("table > tbody").innerHTML = HTML;
	}

	#buildFoot = ()=>{
		if(!("foot" in this.JSON)) return;
		let HTML = "";
		for(const cell of this.JSON["foot"]) HTML += `<td>${cell}</td>`;

		this.querySelector("table > tfoot > tr").innerHTML = HTML;
	}

	////////// Sort
	// Sort click listeners
	#listenToTheSortClicks = ()=>{
		for(const id of this.sortableColumnIDs){
			this.querySelector(`table > thead > tr > th:nth-child(${id+1})`).onclick = ()=>{
				// Update last sorted column ID with the current clicked column ID
				this.lastSortedColumnID = id;

				switch(this.lastSortMode){
				case Table.sortModes.ASC:
					this.#sortDESC();
					this.lastSortMode = Table.sortModes.DESC;
					break;

				case Table.sortModes.DESC:
					this.#sortASC();
					this.lastSortMode = Table.sortModes.ASC;
					break;

				default:
					this.#sortASC();
					this.lastSortMode = Table.sortModes.ASC;
				}

				// Update table view
				this.#buildBody();
			};
		}
	}

	// Sort algo ASC
	#sortASC = ()=>{
		this.bodyValues.sort((a, b)=>{
			// Numerical comparison
			if(!isNaN(a[this.lastSortedColumnID]) && !isNaN(b[this.lastSortedColumnID]))
			return a[this.lastSortedColumnID] - b[this.lastSortedColumnID];

			// String comparison
			else return a[this.lastSortedColumnID].localeCompare(b[this.lastSortedColumnID]);
		});
	}

  	// Sort algo DESC
	#sortDESC = ()=>{
		this.bodyValues.sort((a, b)=>{
			// Numerical comparison
			if(!isNaN(a[this.lastSortedColumnID]) && !isNaN(b[this.lastSortedColumnID]))
				return b[this.lastSortedColumnID] - a[this.lastSortedColumnID];

			// String comparison
			else return b[this.lastSortedColumnID].localeCompare(a[this.lastSortedColumnID]);
		});
	}

	#sortByValue = (value)=>{
		this.bodyValues = [];

		const VALUE_LOWER_CASE = value.toLowerCase();

		for(const row of this.JSON["body"])
			for(const cell of row)
				if(typeof cell === "string" && cell.toLowerCase().includes(VALUE_LOWER_CASE)) this.bodyValues.push(row);

				else if(String(cell).toLowerCase().includes(VALUE_LOWER_CASE)) this.bodyValues.push(row);

		if(this.bodyValues.length === 0) this.bodyValues = [[window.Lang.use("noMatches")]];
	}

	// Divide data to chunks aka pages
	#divideDataIntoChunks = ()=>{
		// Empty the chunks
		this.bodyValuesInChunks = [];

		for(let i = 0; i < this.bodyValues.length; i += this.pageSize)
			this.bodyValuesInChunks.push(this.bodyValues.slice(i, i + this.pageSize));
	}

	///////////// Search input
	#listenToSearchTyping = ()=>{
		this.querySelector("main > row > column > input").oninput = ()=>{
			if(event.target.value == ""){
				this.bodyValues = this.JSON["body"];
				this.#buildBody();
				return;
			}
			this.#sortByValue(event.target.value);
			this.#buildBody();
		}
	}

	///////////// Pagination
	#listenToPageSizeSelect = ()=>{
		this.querySelector("main > row > column > select").onchange = ()=>{
			const selectedPageSize = event.target.value;

			// If not a number then show all
			if(isNaN(selectedPageSize)) this.pageSize = this.JSON["body"].length;

			// Else set page size to the selected
			else this.pageSize = parseInt(selectedPageSize);

			// Reset "currentPage" to 1
			this.currentPage = 1;

			// Update and build the body
			this.#buildBody();

			// Update and build the page buttons
			this.#buildPageButtons();
		}
	}

	#buildShowingCounter = ()=>{
		this.querySelector("main > div[for=paginationContainer]:last-child > div[for=showingCounter]").innerHTML = `
			Page ${this.currentPage} of ${this.bodyValuesInChunks.length}
		`;
	}

	#buildPageButtons = ()=>{
		this.#buildShowingCounter();

		let buttonsHTML = "";

		for(let i = 1; i <= this.bodyValuesInChunks.length; i++) buttonsHTML += `<button class="btn btn-primary btn-s d-none" name="${i}">${i}</button>`;

		this.querySelector("main > div[for=paginationContainer]:last-child > div[for=pagination]").innerHTML = `
			<button class="btn btn-primary btn-s text-transform-uppercase" name="first">${window.Lang.use("first")}</button>
			<button class="btn btn-primary btn-s" name="previous"><x-svg name="arrow_back" color="white"></x-svg></button>
			<section class="d-flex flex-row gap-0-2">${buttonsHTML}</section>
			<button class="btn btn-primary btn-s" name="next"><x-svg name="arrow_forward" color="white"></x-svg></button>
			<button class="btn btn-primary btn-s text-transform-uppercase" name="last">${window.Lang.use("last")}</button>
		`;

		this.firstButton = this.querySelector(`main > div[for=paginationContainer]:last-child > div[for="pagination"] > button[name=first]`);
		this.previousButton = this.querySelector(`main > div[for=paginationContainer]:last-child > div[for="pagination"] > button[name=previous]`);
		this.nextButton = this.querySelector(`main > div[for=paginationContainer]:last-child > div[for=pagination] > button[name=next]`);
		this.lastButton = this.querySelector(`main > div[for=paginationContainer]:last-child > div[for="pagination"] > button[name=last]`);

		this.#updateButtons(this.currentPage);
		this.#listenToPageButtonsClicks();
	}

	#hideButtons = ()=>{
		const buttons = this.querySelectorAll("main > div[for=paginationContainer]:last-child > div[for=pagination] > section > button");

		for(const button of buttons) button.classList.add("d-none");
	}

	#updateButtons = (id)=>{
		// First hide buttons
		this.#hideButtons();

		//// Enable/Disable main buttons
		// Enable/Disable "first" button
		if(id == 1) this.firstButton.disabled = true;
		else this.firstButton.disabled = false;

		// Enable/Disable "previous" button
		if(id > 1) this.previousButton.disabled = false;
		else this.previousButton.disabled = true;

		// Enable/Disable "next" button
		if(id == this.bodyValuesInChunks.length) this.nextButton.disabled = true;
		else this.nextButton.disabled = false;

		// Enable/Disable "last" button
		if(id == this.bodyValuesInChunks.length) this.lastButton.disabled = true;
		else this.lastButton.disabled = false;


		const buttons = [
			this.querySelector(`main > div[for=paginationContainer]:last-child > div[for=pagination] > section > button:nth-child(${id-1})`),
			this.querySelector(`main > div[for=paginationContainer]:last-child > div[for=pagination] > section > button:nth-child(${id})`),
			this.querySelector(`main > div[for=paginationContainer]:last-child > div[for=pagination] > section > button:nth-child(${id+1})`)
		];

		for(const button of buttons) button?.classList.remove("d-none", "disabled", "text-decoration-underline");

		// Current
		buttons[1]?.classList.add("disabled");
		buttons[1]?.classList.add("text-decoration-underline");

		// Update body after current page changes
		this.#buildBody();

		// Update showing counter
		this.#buildShowingCounter();
	}

	#listenToPageButtonsClicks = ()=>{
		// first
		this.firstButton.onclick = ()=> this.#updateButtons((this.currentPage = 1));

		// previous
		this.previousButton.onclick = ()=> this.#updateButtons(--this.currentPage);

		// next
		this.nextButton.onclick = ()=> this.#updateButtons(++this.currentPage);

		// last
		this.lastButton.onclick = ()=> this.#updateButtons((this.currentPage = this.bodyValuesInChunks.length));

		// 1 to this.bodyValuesInChunks.length
		const buttons = this.querySelectorAll("main > div[for=paginationContainer]:last-child > div[for=pagination] > section > button");

		for(const button of buttons) button.onclick = ()=> this.#updateButtons((this.currentPage = parseInt(button.name)));
	}
};

window.customElements.define('x-table', Table);

// Make Table Usable W/O Importing It
window.Table = Table;
