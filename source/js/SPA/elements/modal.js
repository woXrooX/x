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

    // Save the DOM
    this.DOM = this.innerHTML;

    // Clean the innerHTML
    this.innerHTML = "";

    this.shown = false;

    // Parent z-index
    this.zIndexOfParent = getComputedStyle(this.parentElement).getPropertyValue('z-index') || window.CSS.getValue("--z-cover");

    // Clone And Append Template
    this.appendChild(Modal.#template.content.cloneNode(true));

    // Content
    this.querySelector("modal>main").innerHTML = this.DOM;

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
              this.querySelector("trigger").innerHTML = `<button><x-icon color="ffffff" name="${this.getAttribute("value")}"></x-icon></button>`;

            else
              this.querySelector("trigger").innerHTML = `<x-icon color="ffffff" name="${this.getAttribute("value")}"></x-icon>`;
          }

          else if(this.getAttribute("type") === "text"){
            if(this.hasAttribute("button") === true)
              this.querySelector("trigger").innerHTML = `<button>${this.getAttribute("value")}</button>`;

            else
              this.querySelector("trigger").innerHTML = `${this.getAttribute("value")}`;

          }

        }


      // Show On Click trigger
      this.querySelector("trigger").onclick = this.#show;

      // Close On Cover Click
      window.Cover.onClickExecute(this.#hide);

      // Close On X Click
      this.querySelector("modal>header>x-icon").onclick = this.#hide;
    }

  }

  #show = ()=>{
    if(this.shown === true || Modal.#inUse === true) return;

    Modal.#inUse = true;

    this.shown = true;

    this.querySelector("modal").classList.remove("hide");
    this.querySelector("modal").classList.add("show");

    window.Cover.show(this.zIndexOfParent);
  }

  // Regular Function Missing The Context Of "this" When Passed To "window.Cover.onClickExecute"
  #hide = ()=>{
    if(this.shown === false) return;

    Modal.#inUse = false;

    this.shown = false;

    this.querySelector("modal").classList.remove("show");
    this.querySelector("modal").classList.add("hide");

    window.Cover.hide();
  }

};

window.customElements.define('x-modal', Modal);

// Make Modal Usable W/O Importing It
window.Modal = Modal;
