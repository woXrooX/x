export default class Select extends HTMLElement{
	// Identify the element as a form-associated custom element
	static formAssociated = true;

	static #ID = 0;

	static #template = document.createElement("template");

	static {
		Select.#template.innerHTML = `
			<button class="btn btn-primary">Select</button>
			<main>
				<section id="optionsSelected" class="scrollbar-y"></section>
					<!-- <section id="search">
					<input type="text" placeholder="Search...">
				</section> -->
				<section id="optionsToSelect" class="scrollbar-y"></section>
			</main>
		`;
	}

constructor(){
	super();

	// Get access to the internal form control APIs
	this.internals_ = this.attachInternals();
	// internal value for this control
	this.value_ = null;

	// Save the JSON data
	this.JSON = this.innerHTML;

	// Clean the inner data
	this.innerHTML = "";

	// Clone And Append Template
	this.appendChild(Select.#template.content.cloneNode(true));

	// Show And Hide The "x-select > main"
	Toggle: {
		const button = this.querySelector("button");
		button.innerHTML = this.hasAttribute("placeholder") ? window.Lang.use(this.getAttribute('placeholder')) : window.Lang.use("select");

		// On Click
		button.addEventListener("click", ()=>{
			event.preventDefault();
			this.querySelector("main").classList.toggle("show");
		});
	}

	GenerateOptions: {
		// Options
		this.options = JSON.parse(this.JSON).constructor === Array ? JSON.parse(this.JSON) : [];

		let optionsHtml = "";

		for(const option of this.options)
			optionsHtml += `<div value="${option["value"]}">${option.placeholder}</div>`;


		this.querySelector("main > section#optionsSelected").innerHTML = `${optionsHtml}`;

		this.querySelector("main > section#optionsToSelect").innerHTML = `${optionsHtml}`;
	}

	MAX: {
		//// Max Number Of Options That Can Be Selected
		// Default/Fallback Is 1
		this.MAX = 1;

		if(
			// Has Attribute
			this.hasAttribute('max') &&

			// If Valid Number
			isNaN(parseInt(this.getAttribute('max'))) === false &&

			// Positive Number
			parseInt(this.getAttribute('max')) >= 0
		) this.MAX = parseInt(this.getAttribute('max'));

		else this.MAX = this.options.length || this.MAX;
	}

	SelectDeselect: {
		// Elements
		let options = this.querySelectorAll("main > section#optionsToSelect > div");
		let optionsSelected = this.querySelectorAll("main > section#optionsSelected > div");

		// Counter For Selected Options
		let count = 0;

		//// Pre-Selected Options
		// if "selected" key exists then add option to selected
		// NOTE: Value of "selected" doesn't have to be a particular type!
		for(const option of this.options)
			if("selected" in option && count < this.MAX){
				this.querySelector(`main > section#optionsToSelect > div[value=${option.value}]`).style.display = "none";
				this.querySelector(`main > section#optionsSelected > div[value=${option.value}]`).style.display = "block";

				// Show "optionsSelected"
				this.querySelector("main > section#optionsSelected").classList.add("show");

				// Increment The Count
				count++;

				// Update Form Data
				this.#updateFormData();
			}

		// Select
		for(const option of options)
			option.addEventListener("click", ()=>{
				// Check If Exceed The Max
				if(count >= this.MAX){
					x.Toast.new("info", "Maximum number of options you can select is: " + this.getAttribute('max'))
					return;
				}

				// Increment The Count
				count++;

				// Show "optionsSelected"
				if(count === 1) this.querySelector("main > section#optionsSelected").classList.add("show");

				// Hide Section 'optionsToSelect' Only Once When Count Equals To MAX
				if(count === this.options.length) this.querySelector("main > section#optionsToSelect").classList.add("hide");

				// Hide Option From "optionsToSelect"
				option.style.display = "none";

				// Show Option On "optionsSelected"
				this.querySelector(`main > section#optionsSelected > div[value="${option.getAttribute("value")}"]`).style.display = "block";

				// Update Form Data
				this.#updateFormData();
			});

		// Deselect
		for(const option of optionsSelected)
			option.addEventListener("click", ()=>{
				// Decrement The Count
				count--;

				// Hide "optionsSelected"
				if(count === 0) this.querySelector("main > section#optionsSelected").classList.remove("show");

				// Show Section 'optionsToSelect' Only Once When count Equals To MAX
				if(count === this.options.length - 1) this.querySelector("main > section#optionsToSelect").classList.remove("hide");

				// Hide Option From "optionsSelected"
				option.style.display = "none";

				// Show Option On "optionsToSelect"
				this.querySelector(`main > section#optionsToSelect > div[value="${option.getAttribute("value")}"]`).style.display = "block";

				// Update Form Data
				this.#updateFormData();
			});
	}
}

	#updateFormData = ()=>{
		// Create FormData
		const formData = new FormData();

		// Select All Options With Attribute style="display: block;" And Add To FormData Entries
		for(const option of this.querySelectorAll("main > section#optionsSelected > div"))
			if(option.hasAttribute("style") && option.getAttribute("style") === "display: block;")
				formData.append(this.getAttribute('name'), option.innerText);

		// Add Data To Custom Element FormData
		this.internals_.setFormValue(formData);

		// formData.delete(this.getAttribute('name'), option.getAttribute("value"));

		// Fire "input" event manually when form data update happens
		this.dispatchEvent(
			new Event("input", {
				bubbles: true,
				cancelable: true
			})
		);
	};
};

window.customElements.define('x-select', Select);

// Make Select Usable W/O Importing It
window.Select = Select;

// Breaks The Order
// Moves The Element
// MoveOptions: {
//   let options = this.shadow.querySelectorAll("main > section#options > div");
//   let sectionSelected = this.shadow.querySelector("main > section#optionsSelected");
//   let sectionOptions = this.shadow.querySelector("main > section#options");
//
//   for(const option of options)
//     option.addEventListener("click", ()=>{
//       if(option.parentNode.id === "options") sectionSelected.appendChild(option);
//       else sectionOptions.appendChild(option);
//     });
// }
