// <x-icon>yzoken</x-icon>

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
        icon{}
      `;
      this.shadow.appendChild(style);
    }

    // Clone And Append Template
    this.shadow.appendChild(Icon.#template.content.cloneNode(true));

    // SVG
    this.shadow.querySelector("icon").innerHTML = window.SVG.use(this.textContent);

  }

};

window.customElements.define('x-icon', Icon);

// Make Icon Usable W/O Importing It
window.Icon = Icon;
