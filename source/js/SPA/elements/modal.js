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
		Modal.#element.querySelector("x-svg[for=modal_close]").onclick = Modal.hide;

		// Close on click the cover
		Cover.onClickExecute(Modal.hide);
	}

	constructor(){
		super();

		this.DOM = this.innerHTML;

		this.style.cursor = "pointer";

		this.#buildTriggerContent();

		this.onclick = ()=> Modal.#show(this.DOM);
	}

	#buildTriggerContent(){
		const value = this.getAttribute("value");

		let content;

		if(this.getAttribute("type") == "icon") content = `<x-svg color="${this.getAttribute("icon-color")}" name="${value}"></x-svg>`;
		else content = value;

		this.innerHTML = content;
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
