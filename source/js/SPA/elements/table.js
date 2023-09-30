/*
  <x-table class="x-default">
    {
      "enableCounterColumn": true,
      "head": [
        {"title": "ID", "sortable": true},
        {"title": "First name"},
        {"title": "Birth month", "sortable": true}
      ],
      "body": [
        ["1", "Max", "August"],
        ["489", "John", "January"],
        ["2", "Alib", "July"],
        ["28", "Tillo", "December"],
        ["29", "James", "October"],
        ["902", "Ali", "July"],
        ["78", "Yzoken", "March"]
      ],
      "foot": ["foot_a", "foot_b", "foot_c"]
    }
  </x-table>
*/

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

		this.pageSizeCurrent = 10;
		this.currentPage = 1;

		// Init table
		this.#build();

		this.#listenToTheSortClicks();
	}

	#build = ()=>{
		this.innerHTML = `
			<main class="d-flex flex-column gap-0-5">

				<row class="flex-y-center flex-x-between gap-0-5">
					<select class="w-auto">
						<option selected disabled>${this.pageSizeCurrent}</option>
						<option value="10">10</option>
						<option value="15">15</option>
						<option value="20">20</option>
						<option value="25">25</option>
						<option value="50">50</option>
						<option value="100">100</option>
						<option value="all">${window.Lang.use("all")}</option>
					</select>

					${!!this.JSON?.searchable === true ? '<input type="text">' : ""}
				</row>

				<div for="table"></div>

				<row class="flex-x-end">
				< 1 2 3 ... 78 >
				</row>

			</main>
		`;



		this.#listenToPageSizeSelect();

		this.#listenToSearchTyping();

		// this.#buildSearchInput();
		this.#buildTable();
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
						<x-icon color="currentcolor" name="sort_ASC"></x-icon>
						</row>
					</th>
				`;
			}

			// Just title
			else HTML += `<th>${this.JSON["head"][index]["title"]}</th>`;
		}

		this.querySelector("table > thead > tr").innerHTML = HTML;

		this.#buildCounterColumnHead();
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
			for(const cell of row) HTML += `<td>${cell}</td>`;
			HTML += "</tr>";
		}

		this.querySelector("table > tbody").innerHTML = HTML;

		this.#buildCounterColumnBody();
	}

	#buildFoot = ()=>{
		if(!("foot" in this.JSON)) return;
		let HTML = "";
		for(const cell of this.JSON["foot"]) HTML += `<td>${cell}</td>`;

		this.querySelector("table > tfoot > tr").innerHTML = HTML;

		this.#buildCounterColumnFoot();
	}

	////////// Counter column
	#buildCounterColumnHead = ()=>{
		if(!!this.JSON?.enableCounterColumn === false) return;

		const th = document.createElement("th");
		th.innerHTML = '#';
		this.querySelector("table > thead > tr").insertBefore(th, this.querySelector("table > thead > tr > th"));
	}

	#buildCounterColumnBody = ()=>{
		if(!!this.JSON?.enableCounterColumn === false) return;

		for(let i = 1; i <= this.bodyValuesInChunks[this.currentPage-1].length; i++){
			const td = document.createElement("td");
			td.innerHTML = i;
			this.querySelector(`table > tbody > tr:nth-child(${i})`).insertBefore(
				td,
				this.querySelector(`table > tbody > tr:nth-child(${i}) > td`)
			);
		}
	}

	#buildCounterColumnFoot = ()=>{
		if(!!this.JSON?.enableCounterColumn === false) return;

		const td = document.createElement("td");
		this.querySelector("table > tfoot > tr").insertBefore(td, this.querySelector("table > tfoot > tr > td"));
	}

	////////// Sort
	// Sort click listeners
	#listenToTheSortClicks = ()=>{
		// CSS nth child statrs counting from 1 unlike arrays that's why default offset is 1
		// If we add artifical counter column we need to skip the first column so offset becomes 2
		let offset = 1;
		if(!!this.JSON?.enableCounterColumn === true) offset = 2;

		for(const id of this.sortableColumnIDs){
			this.querySelector(`table > thead > tr > th:nth-child(${id+offset})`).onclick = ()=>{
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

		for(const row of this.JSON["body"])
			for(const cell of row)
				if(cell.toLowerCase().includes(value.toLowerCase()))
					this.bodyValues.push(row);

		if(this.bodyValues.length === 0) this.bodyValues = [[window.Lang.use("noMatches")]];
	}

	// Divide data to chunks aka pages
	#divideDataIntoChunks = ()=>{
		// Empty the chunks
		this.bodyValuesInChunks = [];

		for(let i = 0; i < this.bodyValues.length; i += this.pageSizeCurrent)
			this.bodyValuesInChunks.push(this.bodyValues.slice(i, i + this.pageSizeCurrent));
	}

	///////////// Search input
	#listenToSearchTyping = ()=>{
		this.querySelector("main > row > input").oninput = ()=>{
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
		this.querySelector("main > row > select").onchange = ()=>{
			const selectedPageSize = event.target.value;

			// If not a number then show all
			if(isNaN(selectedPageSize)) this.pageSizeCurrent = this.JSON["body"].length;

			// Else set page size to the selected
			else this.pageSizeCurrent = selectedPageSize;

			// Update and build the body
			this.#buildBody();
		}
	}
};

window.customElements.define('x-table', Table);

// Make Table Usable W/O Importing It
window.Table = Table;
