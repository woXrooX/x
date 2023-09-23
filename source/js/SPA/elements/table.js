/*
  {
    "head": [
      {"title": "ID", "sortable": true},
      {"title": "First name", "sortable": true},
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

    this.#buildTable();


    this.#listenToTheSortClicks();
  }

  #buildTable = ()=>{
    this.innerHTML = `
      <table class="${this.getAttribute("class") || ""}">
        <thead><tr>${this.#buildHead()}</tr></thead>
        <tbody></tbody>

        ${this.#buildFoot()}
      </table>
    `;

    this.#buildBody();
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

    return HTML;
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
  }

  #buildFoot = ()=>{
    if(!("foot" in this.JSON)) return;
    let HTML = "<tfoot><tr>";
    for(const cell of this.JSON["foot"]) HTML += `<td>${cell}</td>`;
    HTML += "</tr></tfoot>"
    return HTML;
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
    this.JSON["body"].sort((a, b)=>{
      if(a[this.lastSortedColumnID] < b[this.lastSortedColumnID]) return -1;

      if(a[this.lastSortedColumnID] > b[this.lastSortedColumnID]) return 1;

      return 0;
    });
  }

  // Sort algo DESC
  #sortDESC = (id)=>{
    this.JSON["body"].sort((a, b)=>{
      if(a[this.lastSortedColumnID] < b[this.lastSortedColumnID]) return 1;

      if(a[this.lastSortedColumnID] > b[this.lastSortedColumnID]) return -1;

      return 0;
    });
  }
};

window.customElements.define('x-table', Table);

// Make Table Usable W/O Importing It
window.Table = Table;
