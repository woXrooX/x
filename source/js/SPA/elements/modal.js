// <x-modal>Nothing</x-modal>
// <x-modal trigger="auto">Auto</x-modal>
// <x-modal trigger="click" type="icon" value="avatar">Click + Icon</x-modal>
// <x-modal trigger="click" type="text" value="Click Me">Click + Text</x-modal>
// <x-modal trigger="click" type="icon" value="idea" button>Button + Icon + Click</x-modal>
// <x-modal trigger="click" type="text" value="Click Me" button>Button + Text + Click</x-modal>

"use strict";

export default class Modal extends HTMLElement{
  static #template = document.createElement("template");
  static #inUse = false;

  static {
    Modal.#template.innerHTML = `
      <modal>
        <header>
          <x-icon name="x"></x-icon>
        </header>
        <main></main>
      </modal>
      <trigger></trigger>
    `;

  }

  constructor(){
    super();

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});

    this.shown = false;

    CSS: {
      const style = document.createElement('style');
      style.textContent = `
        ${window.CSS.rules.all}

        modal{
          pointer-events: none;

          background-color: var(--color-surface-4);
          opacity: 0;

          display: block;

          border-radius: var(--radius);
          box-shadow: var(--shadow-default);

          position: fixed;
          z-index: var(--z-modal);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.8);

          transition: var(--transition-velocity) ease-in-out;
          transition-property: transform, opacity;

        }

        modal.show{
          pointer-events: all;

          opacity: 1;

          transform: translate(-50%, -50%) scale(1);

        }

        modal.hide{
          pointer-events: none;

          opacity: 0;

          transform: translate(-50%, -45%) scale(0.9);

        }

        modal > header{
          background: var(--color-surface-2);

          width: 35px;
          height: 35px;

          padding: 5px;
          border-radius: 50%;
          box-shadow: var(--shadow-default);

          position: absolute;
          top: -15px;
          right: -15px;

          transition: var(--transition-velocity) ease-in-out transform;

        }
        modal > header:hover{
          transform: scale(1.1);

        }

        modal > main{
          width: auto;

          width: auto;
          max-width: 80vw;
          height: auto;
          max-height: 80vh;

          overflow: hidden;
          overflow-y: scroll;

          padding: var(--padding);
          padding-top: 25px;

          display: grid;
          place-items: center;

        }

        trigger{
          cursor: pointer;
        }

        trigger:empty{
          pointer-events: none;
        }
      `;

      this.shadow.appendChild(style);
    }

    // Clone And Append Template
    this.shadow.appendChild(Modal.#template.content.cloneNode(true));

    // Content
    this.shadow.querySelector("modal>main").innerHTML = this.innerHTML;

    // Manually Collecting Forms
    window.Form.collect(this.shadow.querySelector("modal>main"));

    Trigger: {
      // Instant Pop-Up
      if(
        !!this.hasAttribute("trigger") === false ||
        !!this.hasAttribute("trigger") === true &&
        this.getAttribute("trigger") === "auto"
      ) setTimeout(this.#show, 500);

      // Create Click Event
      else if(this.getAttribute("trigger") === "click")

        if(!!this.hasAttribute("type") === true && !!this.hasAttribute("value") === true){

          if(this.getAttribute("type") === "icon"){
            if(this.hasAttribute("button") === true)
              this.shadow.querySelector("trigger").innerHTML = `<button><x-icon color="ffffff" name="${this.getAttribute("value")}"></x-icon></button>`;

            else
              this.shadow.querySelector("trigger").innerHTML = `<x-icon color="ffffff" name="${this.getAttribute("value")}"></x-icon>`;

          }


          else if(this.getAttribute("type") === "text"){
            if(this.hasAttribute("button") === true)
              this.shadow.querySelector("trigger").innerHTML = `<button>${this.getAttribute("value")}</button>`;

            else
              this.shadow.querySelector("trigger").innerHTML = `${this.getAttribute("value")}`;

          }

        }


      // Show On Click trigger
      this.shadow.querySelector("trigger").onclick = this.#show;

      // Close On Cover Click
      window.Cover.onClickExecute(this.#hide);

      // Close On X Click
      this.shadow.querySelector("modal>header>x-icon").onclick = this.#hide;

    }

  }

  #show = ()=>{
    if(this.shown === true || Modal.#inUse === true) return;

    Modal.#inUse = true;

    this.shown = true;

    this.shadow.querySelector("modal").classList.remove("hide");
    this.shadow.querySelector("modal").classList.add("show");

    window.Cover.show();

  }

  // Regular Function Missing The Context Of "this" When Passed To "window.Cover.onClickExecute"
  #hide = ()=>{
    if(this.shown === false) return;

    Modal.#inUse = false;

    this.shown = false;

    this.shadow.querySelector("modal").classList.remove("show");
    this.shadow.querySelector("modal").classList.add("hide");

    window.Cover.hide();

  }

};

window.customElements.define('x-modal', Modal);

// Make Modal Usable W/O Importing It
window.Modal = Modal;
