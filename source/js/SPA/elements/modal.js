// <x-modal>Nothing</x-modal>
// <x-modal trigger="auto">Auto</x-modal>
// <x-modal trigger="click" type="icon" value="avatar">Click + Icon</x-modal>
// <x-modal trigger="click" type="text" value="Click Me">Click + Text</x-modal>

"use strict";

export default class Modal extends HTMLElement{
  static #template = document.createElement("template");
  static #inUse = false;

  static {
    Modal.#template.innerHTML = `
      <modal>
        <header>
          <x-icon>x</x-icon>
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
        modal{
          pointer-events: none;

          background-color: ${window.CSS.values.color.surface["4"]};
          opacity: 0;

          display: block;

          width: auto;
          max-width: 80vw;
          height: auto;
          max-height: 80vh;

          border-radius: ${window.CSS.values.radius.default};
          box-shadow: ${window.CSS.values.shadow.default};

          position: fixed;
          z-index: ${window.CSS.values.zIndex.modal};
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.8);

          transition: ${window.CSS.values.transition.velocity} ease-in-out;
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
          width: 100%;
          height: 35px;

          display: flex;
          justify-content: flex-end;

        }

        modal > main{
          width: auto;

          padding: ${window.CSS.values.padding.default};

          display: grid;
          place-items: center;

        }

        trigger:empty{
          pointer-events: none;
        }

        trigger > button{
          background-color: ${window.CSS.values.color.main};
          color: white;
          overflow: hidden;
          width: auto;
          height: 50px;
          padding: 0px 5px;
          border-radius: ${window.CSS.values.padding.default};
          border: none;
          text-transform: uppercase;

          cursor: pointer;

          filter: brightness(120%);
          transition: ${window.CSS.values.transition.velocity} filter;

        }

        trigger > button:hover{
          filter: brightness(80%);
        }

        ${window.CSS.rules.form}

      `;
      
      this.shadow.appendChild(style);
    }

    // Clone And Append Template
    this.shadow.appendChild(Modal.#template.content.cloneNode(true));

    // Content
    this.shadow.querySelector("modal>main").innerHTML = this.innerHTML;

    // Manually Collecting Forms
    window.Form.collect(this.shadow.querySelector("modal>main"));

    Interactions: {
      // Instant Pop-Up
      if(
        !!this.hasAttribute("trigger") === false ||
        !!this.hasAttribute("trigger") === true &&
        this.getAttribute("trigger") === "auto"
      ) setTimeout(this.#show, 500);

      // Create Click Event
      else if(this.getAttribute("trigger") === "click")

        if(!!this.hasAttribute("type") === true && !!this.hasAttribute("value") === true)

          if(this.getAttribute("type") === "icon")
            this.shadow.querySelector("trigger").innerHTML = `<x-icon>${this.getAttribute("value")}</x-icon>`;


          else if(this.getAttribute("type") === "text")
            this.shadow.querySelector("trigger").innerHTML = `<button>${this.getAttribute("value")}</button>`;


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
