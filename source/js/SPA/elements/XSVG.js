// v0.2.0

// SVG shadow
// filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5));

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

					&.disabled{
						cursor: not-allowed !important;
						transition: none !important;
						transform: none !important;
						opacity: 0.5 !important;
					}

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
					}
				}
			</style>

			<span>${window.SVG.use(this.getAttribute("name"))}</span>
		`;

		this.svgContainer = this.shadow.querySelector("span");

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

	#disable(){this.svgContainer.classList.add("disabled");}

	#enable(){this.svgContainer.classList.remove("disabled");}

	////////// APIs
	forceToggle = this.#toggler;

	////////// Getters
	// Get SVG name
	get name(){return this.getAttribute("name");}

	// Get SVG toggle name
	get toggle(){return this.getAttribute("toggle");}

	// Get disabled attribute
	get disable(){return this.getAttribute("disabled");}

	////////// Setters
	// Set SVG name
	set name(value){
		this.setAttribute("name", value);
		if(this.toggled === false) this.svgContainer.innerHTML = window.SVG.use(value);
	}

	// Set SVG toggle name
	set toggle(value){
		this.setAttribute("toggle", value);
		if(this.toggled === true) this.svgContainer.innerHTML = window.SVG.use(value);
	}

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
