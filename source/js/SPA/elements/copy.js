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

    ClickEvents: {

      this.copyElement = this.shadow.querySelector("copy");
      this.isClicked = false;

      this.onclick = ()=>{
        // Check If Selector Passed As Argument
        if(!!this.selector === false) return;

        // Select The Element
        const element = document.querySelector(this.selector);

        // Check If Corresponding Element To The Selector Exists
        if(!!element === false) return;

        // Check If Already Clicked
        if(!!this.isClicked === true) return;

        // State: Clicked
        this.isClicked = true;

        // Copy The Value
        navigator.clipboard.writeText(element.innerText);

        // Disable The Copy Button
        this.copyElement.setAttribute("disabled", "");

        // Change The Copy Icon To Done
        this.copyElement.innerHTML = "<x-icon color='var(--color-success)'>done</x-icon>";

        // Show Toast
        window.Toast.new("info", "Copied");

        // Restore The Un-Clicked State
        setTimeout(()=>{
          // Enable The Copy Button
          this.copyElement.removeAttribute("disabled");

          // Back To Copy Icon
          this.copyElement.innerHTML = "<x-icon>copyContent</x-icon>";

          // State: Un-Clicked
          this.isClicked = false;

        }, 5000);

      };
    }

  }

};

window.customElements.define('x-copy', Copy);

// Make Copy Usable W/O Importing It
window.Copy = Copy;
