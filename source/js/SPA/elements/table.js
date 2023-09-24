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

    // Sortable column IDs
    this.sortableColumnIDs = [];
    this.lastSortedColumnID = null;
    this.lastSortMode = null;

    // Init table
    this.#buildTable();

    this.#listenToTheSortClicks();
  }

  #buildTable = ()=>{
    this.innerHTML = `
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
    if(!("body" in this.JSON)) return;
    let HTML = "";
    for(const row of this.JSON["body"]){
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

  ///// Counter column
  #buildCounterColumnHead = ()=>{
    if(!!this.JSON?.enableCounterColumn === false) return;

    const th = document.createElement("th");
    th.innerHTML = '#';
    this.querySelector("table > thead > tr").insertBefore(th, this.querySelector("table > thead > tr > th"));
  }

  #buildCounterColumnBody = ()=>{
    if(!!this.JSON?.enableCounterColumn === false) return;

    for(let i = 1; i <= this.JSON["body"].length; i++){
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
    this.JSON["body"].sort((a, b)=>{
      // Numerical comparison
      if(!isNaN(a[this.lastSortedColumnID]) && !isNaN(b[this.lastSortedColumnID]))
        return a[this.lastSortedColumnID] - b[this.lastSortedColumnID];

      // String comparison
      else return a[this.lastSortedColumnID].localeCompare(b[this.lastSortedColumnID]);
    });
  }

  // Sort algo DESC
  // Due to first sort mode is always ASC reverse works
  #sortDESC = ()=> this.JSON["body"].reverse();
};

window.customElements.define('x-table', Table);

// Make Table Usable W/O Importing It
window.Table = Table;
