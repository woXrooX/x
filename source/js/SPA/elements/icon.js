// <x-icon>yzoken</x-icon>
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
        icon{
          cursor: ${this.parentElement.getAttribute("disabled") !== null ? 'not-allowed' : 'pointer'};
          display: block;

        }
        icon > svg{
          user-select: none;
          width: 100%;
          height: 100%;

          fill: ${this.getAttribute("color") || "var(--color-text-primary)"};

          filter: brightness(100%);

          transition: 100ms ease-in-out;
          transition-property: transform, filter;

        }
      `;
      this.shadow.appendChild(style);
    }

    // Clone And Append Template
    this.shadow.appendChild(Icon.#template.content.cloneNode(true));


    // SVG
    this.shadow.querySelector("icon").innerHTML = window.SVG.use(this.textContent);

    this.svg = this.shadow.querySelector("icon>svg");

    Events: {
      // Hover In
      this.addEventListener("mouseover", ()=>{
        this.svg.style.filter = "brightness(90%)";
        this.svg.style.transform = "scale(1.1)";
      });

      // Hover Out
      this.addEventListener("mouseout", ()=>{
        this.svg.style.filter = "brightness(100%)";
        this.svg.style.transform = "scale(1)";
      });

      // Down
      this.addEventListener("mousedown", ()=>{
        this.svg.style.transform = "scale(0.5)";
      });

      // Up
      this.addEventListener("mouseup", ()=>{
        this.svg.style.transform = "scale(1)";
      });

    }

  }

};

window.customElements.define('x-icon', Icon);

// Make Icon Usable W/O Importing It
window.Icon = Icon;
