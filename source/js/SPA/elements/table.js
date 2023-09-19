{/* <x-table class="x-default">
{
  "head": ["head_a", "head_b", "head_c"],
  "body": [
    ["${myModal}", "b_1", "c_1"],
    ["a_2", "b_2", "c_2"]
  ],
  "foot": ["foot_a", "foot_b", "foot_c"]
}
</x-table> */}

export default class Table extends HTMLElement{
    constructor(){
        super();

        // Save the JSON data
        this.JSON = JSON.parse(this.innerHTML).constructor === Object ? JSON.parse(this.innerHTML) : {};

        // Clean the inner data
        this.innerHTML = `
          <table class="${this.getAttribute("class") || ""}">
            ${this.#buildHead()}
            ${this.#buildBody()}
            ${this.#buildFoot()}
          </table>
        `;
    }

    #buildHead = ()=>{
      if(!("head" in this.JSON)) return;
      let HTML = "<thead><tr>";
      for(const cell of this.JSON["head"]) HTML += `<th>${cell}</th>`;
      HTML += "</tr></thead>"
      return HTML;
    }

    #buildBody = ()=>{
      if(!("body" in this.JSON)) return;
      let HTML = "<tbody>";
      for(const row of this.JSON["body"]){
        HTML += "<tr>";
        for(const cell of row) HTML += `<td>${cell}</td>`;
        HTML += "</tr>";
      }
      HTML += "</tbody>"
      return HTML;
    }

    #buildFoot = ()=>{
      if(!("foot" in this.JSON)) return;
      let HTML = "<tfoot><tr>";
      for(const cell of this.JSON["foot"]) HTML += `<td>${cell}</td>`;
      HTML += "</tr></tfoot>"
      return HTML;
    }
};

window.customElements.define('x-table', Table);

// Make Table Usable W/O Importing It
window.Table = Table;
