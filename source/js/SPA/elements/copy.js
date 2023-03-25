// <x-icon>yzoken</x-icon>

"use strict";

export default class Copy extends HTMLElement{
  static #template = document.createElement("template");

  static {
    Copy.#template.innerHTML = `
      <copy>
        <x-icon>copyContent</x-icon>
      </copy>
    `;
  }

  constructor(){
    super();

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});

    Selector: {
      if(this.hasAttribute("selector"))
        this.selector = this.getAttribute("selector");

    }

    CSS: {
      const style = document.createElement('style');
      style.textContent = `
        copy{
          width: 50px;
          height: 50px;
        }
      `;
      this.shadow.appendChild(style);
    }

    // Clone And Append Template
    this.shadow.appendChild(Copy.#template.content.cloneNode(true));

    this.onclick = ()=>{
      if(!!this.selector === false) return;

      // Select The Element
      const element = document.querySelector(this.selector);

      if(!!element === false) return;

      // Copy The Value
      navigator.clipboard.writeText(element.innerText);

      window.Toast.new("info", "Copied");

    };

  }

};

window.customElements.define('x-copy', Copy);

// Make Copy Usable W/O Importing It
window.Copy = Copy;
