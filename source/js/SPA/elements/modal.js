"use strict";

export default class Modal extends HTMLElement{
	static #selector = "body > modal";
	static #element = null;
	static #elementMain = null;
	static #shown = false;

	static {
		Modal.#element = document.querySelector(Modal.#selector);
		Modal.#elementMain = Modal.#element.querySelector("main");

		// Hide on click close button
		Modal.#element.querySelector("x-icon[for=modal_close]").onclick = Modal.hide;

		// Close on click the cover
		Cover.onClickExecute(Modal.hide);
	}

	constructor(){
		super();

		// Save the DOM
		this.DOM = this.innerHTML;

		this.innerHTML = `<trigger class="cursor-pointer"></trigger>`;

		this.trigger = this.querySelector("trigger");

		Trigger: {
			const type = this.getAttribute("type");
			const value = this.getAttribute("value");
			const isButton = this.hasAttribute("button");

			// Create Click Event
			if(type && value){
				let content;
				switch(type){
					case 'icon':
						const color = this.hasAttribute("icon-color") ? `color="${this.getAttribute("icon-color")}"` : "";
						content = `<x-icon ${color} name="${value}"></x-icon>`;
						break;
					case 'text':
						content = value;
						break;
					default:
						Log.error(`Invalid type: ${type}`);
						return;
				}

				this.trigger.innerHTML = isButton ? `<button class="btn btn-primary">${content}</button>` : content;
			}

			// Show On Click trigger
			this.trigger.onclick = ()=>{Modal.#show(this.DOM);};
		}
	}

	static #show(DOM){
		if(Modal.#shown === true) return;

		Modal.#shown = true;

		Modal.#element.classList.add("show");
		Modal.#elementMain.innerHTML = DOM;

		Form.collect(Modal.#element);

		Cover.show();
	}

	static hide(){
		if(Modal.#shown === false) return;

		Modal.#shown = false;

		Modal.#element.classList.remove("show");

		Modal.#element.ontransitionend = ()=>{
			Modal.#elementMain.innerHTML = "";
			Modal.#element.ontransitionend = null;
		};

		Cover.hide();
	}
};

window.customElements.define('x-modal', Modal);

// Make Modal Usable W/O Importing It
window.Modal = Modal;
