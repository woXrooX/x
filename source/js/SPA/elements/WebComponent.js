// Useful Links

// Native Form Behaviour
// https://web.dev/more-capable-form-controls/

"use strict";

export default class WC extends HTMLElement{
	//// Native Form Behaviour
	// Identify the element as a form-associated custom element
	static formAssociated = true;

	static #template = document.createElement("template");

	static {
		WC.#template.innerHTML = `
			<wc>Content</wc>
		`;
	}

	#DOM = null;
	#JSON = {};

	constructor(){
		super();

		// Content as a JSON
		try{this.#JSON = JSON.parse(this.innerHTML);}
		catch(error){console.warn("WC: Not JSON-able content.");}

		//// Native Form Behaviour
		// Get access to the internal form control APIs
		this.internals_ = this.attachInternals();
		// internal value for this control
		this.value_ = null;

		//// Shadow DOM
		// If you don't set this.attachShadow({mode: 'open'}) or this.attachShadow({mode: 'closed'}) in your web component constructor,
		// the default behavior will be to not use Shadow DOM at all.
		// This means that the component's internal structure will not be encapsulated, and it will behave like a regular DOM element.
		this.innerHTML = "Some HTML";

		// Clean up
		this.replaceChildren();

		// Closed
		this.shadow = this.attachShadow({mode: 'closed'});
		this.shadow.innerHTML = "Some HTML";

		// Open
		// sets and returns 'this.shadowRoot'
		this.attachShadow({mode: "open"});
		this.shadowRoot.innerHTML = "Some HTML";

		// Slot - Use a slot to accept content passed to the component
		// const slot = document.createElement('slot');
		// this.shadow.appendChild(slot);
		// slot.addEventListener('slotchange', (event) => {
		// 	const nodes = slot.assignedNodes();
		// 	console.log('Slotted content changed:', nodes);
		// });

		// DOM: {
		// 	const content = JSON.parse(this.textContent);
		// 	const dom = JTD(content);
		// 	this.shadow.appendChild(dom);
		// }

		// CSS: {
		// 	const style = document.createElement('style');
		// style.textContent = `
		// 	:host {
		// 		display: none; /* Default display is none */
		// 	}
		// `;
		// 	this.shadow.appendChild(style);
		// }

		// Clone And Append Template
		this.shadow.appendChild(WC.#template.content.cloneNode(true));


		//// Native Form Behaviour
		// Create FormData
		const entries = new FormData();
		// Add To Form Entry
		entries.append("name", "value");
		// Add To Form Data
		this.internals_.setFormValue(entries);

	}

	// The connectedCallback method is called each time the custom element is appended to a document-connected element.
	connectedCallback(){
		console.log("connectedCallback");
	}

	// The disconnectedCallback method is called each time the custom element is removed from the document.
	disconnectedCallback(){
		console.log("disconnectedCallback");
	}

	// This callback is invoked when a custom element is moved to a new document.
	adoptedCallback(){
		console.log("adoptedCallback");
	}

	// List Attributes To Be Observed
	static get observedAttributes(){
		return ["attr1", "attr2"];
	}

	// The attributeChangedCallback method is invoked whenever one of the element's observed attributes is added, removed, or changed.
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

window.customElements.define('x-wc', WC);

// Make WC Usable W/O Importing It
window.x["WC"] = WC;
