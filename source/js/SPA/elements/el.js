"use strict";

export default class El extends HTMLElement{
  static #template = document.createElement("template");

  static {
    El.#template.innerHTML = `
      <el>Content</el>
    `;
  }

  constructor(){
    super();

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});

    // Open
    // this.attachShadow({mode: 'open'});
    // this.shadowRoot.appendChild(Node);
    // this.shadowRoot.querySelector("toast>main>icon").innerHTML = "HTML";

    // Clone And Append Template
    this.shadow.appendChild(El.#template.content.cloneNode(true));

    DOM: {
      // const content = JSON.parse(this.textContent);
      //
      // const dom = Dom.jsonToDom(content);
      //
      // this.shadow.appendChild(dom);

    }

    // CSS: {
    //     const style = document.createElement('style');
    //     style.textContent = ``;
    //     // shadow.appendChild(style);
    // }
  }

  connectedCallback(){
    console.log("connectedCallback");
  }

  disconnectedCallback(){
    console.log("disconnectedCallback");
  }

  adoptedCallback(){
    console.log("adoptedCallback");
  }

  // List Attributes To Be Observed
  static get observedAttributes(){
    return ["attr1", "attr2"];
  }

  // name = attribute name
  // old and new attribute values
  attributeChangedCallback(attributeName, oldValue, newValue){
    console.log("attributeChangedCallback");
  }

};

window.customElements.define('x-el', El);

// Make El Usable W/O Importing It
window.El = El;
