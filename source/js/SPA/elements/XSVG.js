// v0.1.1

// SVG shadow
// filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5));

// TO be added to docs
// icon.forceToggle()
// setAttribute observers removed. too many ways doing the same stuff

"use strict";

export default class XSVG extends HTMLElement{
	constructor(){
		super();

		this.shadow = this.attachShadow({mode: 'closed'});

		this.shadow.innerHTML = `
			<style>
				:host{
					display: inline-block;
					vertical-align:middle;

					width: 1em;
					height: 1em;

					cursor: pointer;
					user-select: none;
				}

				span{
					width: 1em;
					height: 1em;

					& > svg{
						width: 1em;
						height: 1em;

						fill: ${this.getAttribute("color") || "var(--color-text-primary)"};

						transition: 100ms ease-in-out;
						transition-property: transform;

						&:hover{
							transform: scale(1.3);
						}

						&:active{
							transform: scale(0.5);
						}

						&.disabled{
							cursor: not-allowed !important;
							transition: none !important;
							transform: none !important;
							opacity: 0.5 !important;
						}
					}
				}
			</style>

			<span>${window.SVG.use(this.getAttribute("name"))}</span>
		`;

		this.svgContainer = this.shadow.querySelector("span > svg");

		//// Disabled
		// Check If Parent Has Attribute Disabled Then Disable SVG
		this.disabled = this.parentElement.hasAttribute("disabled") === true ? true : false;
		// Initial Disabled?Enabled Status Update
		this.disabled === true ? this.#disable() : this.#enable();

		// Is Toggled?
		this.toggled = false;

		// On click toggle
		this.addEventListener("click", this.#toggler);
	}

	////////// Helpers
	#toggler(){
		// If Disabled Do Nothing
		if(this.disabled === true) return;

		// If No "toggle" Attribute Then Exit The Method
		if(this.hasAttribute("toggle") === false) return;

		// Set SVG To "name" Value
		if(this.toggled === true) this.svgContainer.innerHTML = window.SVG.use(this.getAttribute("name"));

		// Set SVG To "toggle" Value
		else this.svgContainer.innerHTML = window.SVG.use(this.getAttribute("toggle"));

		// Update The Value
		this.toggled = !this.toggled;
	}

	// Disabler Method
	#disable(){this.svgContainer.classList.add("disabled");}

	// Enabler Method
	#enable(){this.svgContainer.classList.remove("disabled");}

	////////// APIs
	forceToggle = this.#toggler;

	////////// Getters
	// Get SVG Name
	get name(){return this.getAttribute("name");}

	// Get toggle SVG name
	get toggle(){return this.getAttribute("toggle");}

	// Get disabled status
	get disable(){return this.getAttribute("disabled");}

	////////// Setters
	// Set SVG Name
	set name(value){this.svgContainer.innerHTML = window.SVG.use(value);}

	// Set toggle SVG name
	set toggle(value){return this.setAttribute("toggle", value);}

	// Sets disabled status
	set disable(value){
		// Disable
		if(value === "false" || value === false){
			this.disabled = false;
			this.#enable();
		}

		// Enable
		else{
			this.disabled = true;
			this.#disable();
		}
	}
};

window.customElements.define('x-svg', XSVG);

// Make XSVG Usable W/O Importing It
window.XSVG = XSVG;
