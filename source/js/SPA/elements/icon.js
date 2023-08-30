// SVG shadow
// filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5));

"use strict";

export default class Icon extends HTMLElement{
  static #template = document.createElement("template");

  static {
    Icon.#template.innerHTML = `<icon></icon>`;
  }

  constructor(){
    super();

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});

    CSS: {
      const style = document.createElement('style');
      style.textContent = `

        .disabled{
          cursor: not-allowed !important;
          transition: none !important;
          transform: none !important;
          opacity: 0.5 !important;
        }

        icon{
          cursor: pointer;
          user-select: none;

          display: block;

          transition: 100ms ease-in-out;
          transition-property: transform;

        }
        icon:hover{
          transform: scale(1.3);
        }
        icon:active{
          transform: scale(0.5);
        }

        icon > svg{
          user-select: none;

          width: 100%;
          height: 100%;

          fill: ${this.getAttribute("color") || "var(--color-text-primary)"};

        }

      `;
      this.shadow.appendChild(style);

    }

    // Clone And Append Template
    this.shadow.appendChild(Icon.#template.content.cloneNode(true));

    // Element Icon
    this.elementIcon = this.shadow.querySelector("icon");

    // Set The Initial Icon
    this.#setIcon(this.getAttribute("name"));

    // Disabled
    // Check If Parent Has Attribute Disabled Then Disable Icon
    this.disabled = this.parentElement.hasAttribute("disabled") === true ? true : false;
    // Initial Disabled?Enabled Status Update
    this.disabled === true ? this.#disable() : this.#enable();

    // Is Toggled?
    this.toggled = false;

    Events: {
      // Click
      this.addEventListener("click", ()=>{
        this.#toggler();
      });
    }

  }

  ////////// Helpers
  // Set Icon
  #setIcon(iconName){
    this.elementIcon.innerHTML = window.SVG.use(iconName);

    // Update SVG Variable After New SVG Element Inserted
    this.svg = this.shadow.querySelector("icon>svg");

  }

  // Toggler
  #toggler(){
    // If Disabled Do Nothing
    if(this.disabled === true) return;

    // If No "toggle" Attribute Then Exit The Method
    if(this.hasAttribute("toggle") === false) return;

    // Set Icon To "name" Value
    if(this.toggled === true) this.#setIcon(this.getAttribute("name"));

    // Set Icon To "toggle" Value
    else this.#setIcon(this.getAttribute("toggle"));

    // Update The Value
    this.toggled = !this.toggled;
  }

  // Disabler Method
  #disable(){
    this.elementIcon.classList.add("disabled");
  }

  // Enabler Method
  #enable(){
    this.elementIcon.classList.remove("disabled");
  }

  ////////// Getters
  // Get toggle icon name
  get toggle(){return this.getAttribute("toggle");}

  // Get Icon Name
  get name(){return this.getAttribute("name");}

  ////////// Setters
  // Set toggle icon name
  set toggle(value){return this.setAttribute("toggle", value);}

  // Set Icon Name
  set name(value){this.setAttribute("name", value);}

  set setDisabled(value){
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

  ////////// Observer
  // On Observed Atributes Change
  attributeChangedCallback(attributeName, oldValue, newValue){
    // Update Icon On "name" Change
    if(attributeName === "name" && oldValue !== newValue) this.#setIcon(newValue);

    // Update "disabled" Status
    if(attributeName === "disabled" && oldValue !== newValue) this.setDisabled = newValue;
  }

  // Attributes To Be Observed
  static get observedAttributes(){return ["toggle", "disabled", "name"];}

};

window.customElements.define('x-icon', Icon);

// Make Icon Usable W/O Importing It
window.Icon = Icon;
