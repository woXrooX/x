// Useful Links

// Native Form Behaviour
// https://web.dev/more-capable-form-controls/

"use strict";

export default class El extends HTMLElement{
  //// Native Form Behaviour
  // Identify the element as a form-associated custom element
  static formAssociated = true;

  static #template = document.createElement("template");

  static {
    El.#template.innerHTML = `
      <el>Content</el>
    `;
  }

  constructor(){
    super();

    //// Native Form Behaviour
    // Get access to the internal form control APIs
    this.internals_ = this.attachInternals();
    // internal value for this control
    this.value_ = null;

    //// Shadow DOM
    // If you don't set this.attachShadow({mode: 'open'}) or this.attachShadow({mode: 'closed'}) in your web component constructor,
    // the default behavior will be to not use Shadow DOM at all.
    // This means that the component's internal structure will not be encapsulated, and it will behave like a regular DOM element.
    this.innerHTML = "Some html";

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});
    this.shadow.innerHTML = "Some html";

    // Open
    // sets and returns 'this.shadowRoot'
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = "Some html";

    // Open
    // this.attachShadow({mode: 'open'});
    // this.shadowRoot.appendChild(Node);
    // this.shadowRoot.querySelector("toast>main>icon").innerHTML = "HTML";

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

    // Clone And Append Template
    this.shadow.appendChild(El.#template.content.cloneNode(true));


    //// Native Form Behaviour
    // Create FormData
    const entries = new FormData();
    // Add To Form Entry
    entries.append("name", "value");
    // Add To Form Data
    this.internals_.setFormValue(entries);

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

  ////// Form Methods/APIs
  // Form controls usually expose a "value" property
  // get value() { return this.value_; }
  // set value(v) { this.value_ = v; }
  //
  // // The following properties and methods aren't strictly required,
  // // but browser-level form controls provide them. Providing them helps
  // // ensure consistency with browser-provided controls.
  // get form() { return this.internals_.form; }
  // get name() { return this.getAttribute('name'); }
  // get type() { return this.localName; }
  // get validity() {return this.internals_.validity; }
  // get validationMessage() {return this.internals_.validationMessage; }
  // get willValidate() {return this.internals_.willValidate; }
  //
  // checkValidity() { return this.internals_.checkValidity(); }
  // reportValidity() {return this.internals_.reportValidity(); }


};

window.customElements.define('x-el', El);

// Make El Usable W/O Importing It
window.El = El;
