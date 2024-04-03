"use strict";

export default class Modal extends HTMLElement{
	static #selector = "body > modal";
	static #element = null;
	static elementMain = null;
	static #shown = false;
	static #FUNC_POOL = {};

	static {
		Modal.#element = document.querySelector(Modal.#selector);
		Modal.elementMain = Modal.#element.querySelector("main");

		// Hide on click close button
		Modal.#element.querySelector("x-svg[for=modal_close]").onclick = Modal.hide;

		// Close on click the cover
		Cover.onClickExecute(Modal.hide);
	}

	static async #execute_on_show(func_name){
		if(!!func_name === false) return;
		await Modal.#FUNC_POOL[func_name]();
	}

	static push_func(func){ Modal.#FUNC_POOL[func.name] = func; }

	static #show(DOM, func_name = null){
		if(Modal.#shown === true) return;

		Modal.#shown = true;

		Modal.#element.classList.add("show");
		Modal.elementMain.innerHTML = DOM;
		Modal.#execute_on_show(func_name);

		Cover.show();
	}

	static hide(){
		if(Modal.#shown === false) return;

		Modal.#shown = false;

		Modal.#element.classList.remove("show");

		Modal.#element.ontransitionend = ()=>{
			Modal.elementMain.innerHTML = "";
			Modal.#element.ontransitionend = null;
		};

		Cover.hide();
	}

	/////////////// x-modal object
	#DOM = null;

	constructor(){
		super();
		this.shadow = this.attachShadow({mode: 'closed'});
		this.#DOM = this.innerHTML;

		CSS: {
			const style = document.createElement('style');
			style.textContent = `:host {display: none;}`;
			this.shadow.appendChild(style);
		}

		this.#handle_trigger();
	}

	#handle_trigger = ()=>{
		switch (this.getAttribute("trigger_type")){
			case "click":
				this.#handle_trigger_click();
				break;

			case "hover":
				this.#handle_trigger_hover();
				break;

			case "auto":
				this.#handle_trigger_auto();
				break;

			default:
				this.#handle_trigger_click();
				break;
		}
	};

	#handle_trigger_click = ()=>{
		const trigger_element = document.querySelector(this.getAttribute("trigger_selector"));
		if(!!trigger_element === false) return;
		trigger_element.style.cursor = "pointer";
		trigger_element.onclick = ()=> Modal.#show(this.#DOM, this.getAttribute("func_name"));
	};

	#handle_trigger_hover = ()=>{
	};

	#handle_trigger_auto = ()=>{
	};
};

window.customElements.define('x-modal', Modal);

// Make Modal Usable W/O Importing It
window.Modal = Modal;
