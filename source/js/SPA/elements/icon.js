// SVG shadow
// filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5));

// TO be added to docs
// icon.forceToggle()
// setAttribute observers removed. too many ways doing the same stuff

"use strict";

export default class Icon extends HTMLElement{
  constructor(){
    super();

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});

    CSS: {
      const style = document.createElement('style');
      style.textContent = `
        icon{
          cursor: pointer;
          user-select: none;

          display: grid;
          place-items: center;

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

          & > svg{
            user-select: none;

            width: 100%;
            height: 100%;

            fill: ${this.getAttribute("color") || "var(--color-text-primary)"};
          }
        }
      `;
      this.shadow.appendChild(style);

    }

    // Clone And Append Template
    this.shadow.appendChild(document.createElement('icon'));

    // Element Icon
    this.elementIcon = this.shadow.querySelector("icon");

    // Set The Initial Icon
    this.#setIconName(this.getAttribute("name"));

    //// Disabled
    // Check If Parent Has Attribute Disabled Then Disable Icon
    this.disabled = this.parentElement.hasAttribute("disabled") === true ? true : false;
    // Initial Disabled?Enabled Status Update
    this.disabled === true ? this.#disable() : this.#enable();

    // Is Toggled?
    this.toggled = false;

	// On click toggle
	this.addEventListener("click", this.#toggler);
  }

	////////// Helpers
	// Set Icon
	#setIconName(name){
		this.elementIcon.innerHTML = window.SVG.use(name);

		// Update SVG Variable After New SVG Element Inserted
		this.svg = this.shadow.querySelector("icon > svg");
	}

	#toggler(){
		// If Disabled Do Nothing
		if(this.disabled === true) return;

		// If No "toggle" Attribute Then Exit The Method
		if(this.hasAttribute("toggle") === false) return;

		// Set Icon To "name" Value
		if(this.toggled === true) this.#setIconName(this.getAttribute("name"));

		// Set Icon To "toggle" Value
		else this.#setIconName(this.getAttribute("toggle"));

		// Update The Value
		this.toggled = !this.toggled;
	}

	// Disabler Method
	#disable(){this.elementIcon.classList.add("disabled");}

	// Enabler Method
	#enable(){this.elementIcon.classList.remove("disabled");}

	////////// APIs
	forceToggle = this.#toggler;

	////////// Getters
	// Get Icon Name
	get name(){return this.getAttribute("name");}

	// Get toggle icon name
	get toggle(){return this.getAttribute("toggle");}

	// Get disabled status
	get disable(){return this.getAttribute("disabled");}

	////////// Setters
  	// Set Icon Name
	set name(value){this.#setIconName(value);}

	// Set toggle icon name
	set toggle(value){return this.setAttribute("toggle", value);}

	// Sets disabled status
	set disable(value){
		// Disable
		if(value === "false" || value === false){
			this.disabled = false;
			this.#enable();

		// Enable
		}else{
			this.disabled = true;
			this.#disable();
		}
	}
};

window.customElements.define('x-icon', Icon);

// Make Icon Usable W/O Importing It
window.Icon = Icon;
