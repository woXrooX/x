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
		Modal.#element.querySelector("button").onclick = Modal.#hide;

		// Close on click the cover
		Cover.onClickExecute(Modal.#hide);
	}

	constructor(){
		super();

		// Save the DOM
		this.DOM = this.innerHTML;

		this.innerHTML = `<trigger class="cursor-pointer"></trigger>`;

		this.trigger = this.querySelector("trigger");

		Trigger: {
			const trigger = this.getAttribute("trigger");
			const type = this.getAttribute("type");
			const value = this.getAttribute("value");
			const isButton = this.hasAttribute("button");

			// Instant Pop-Up
			if(!trigger || trigger === "auto") setTimeout(this.#show, 500);

			// Create Click Event
			else if(trigger === "click" && type && value){
				let content;
				switch(type){
					case 'icon':
						content = `<x-icon name="${value}"></x-icon>`;
						break;
					case 'text':
						content = value;
						break;
					default:
						Log.error(`Invalid type: ${type}`);
						return;
				}

				this.trigger.innerHTML = isButton ? `<button>${content}</button>` : content;
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

	static #hide(){
		if(Modal.#shown === false) return;

		Modal.#shown = false;

		Modal.#element.classList.remove("show");

		Modal.#elementMain.ontransitionend = ()=>{
			Modal.#elementMain.innerHTML = "";
			Modal.#elementMain.ontransitionend = null;
		};

		Cover.hide();
	}
};

window.customElements.define('x-modal', Modal);

// Make Modal Usable W/O Importing It
window.Modal = Modal;
