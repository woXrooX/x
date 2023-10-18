"use strict";

export default class Modal extends HTMLElement{
	constructor(){
		super();

		// Save the DOM
		this.DOM = this.innerHTML;

		// Clean the innerHTML
		this.innerHTML = `
			<dialog inert>
				<button><x-icon name="x" color="ffffff"></x-icon></button>
				<main>${this.DOM}</main>
			</dialog>
			<trigger></trigger>
		`;

		this.dialog = this.querySelector("dialog");
		this.trigger = this.querySelector("trigger");

		// Parent z-index
		this.zIndexOfParent = getComputedStyle(this.parentElement).getPropertyValue('z-index');

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
						content = `<x-icon color="ffffff" name="${value}"></x-icon>`;
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
			this.trigger.onclick = this.#show;

			// Close On X Click
			this.querySelector("dialog > button").onclick = this.#hide;

			// Close on click the ::backdrop
			this.dialog.addEventListener("click", ()=>{if(event.target === this.dialog) this.#hide();});
		}

	}

	#show = ()=> {
		this.dialog.showModal();
		this.dialog.removeAttribute("inert");
		this.#animationIn();

		// disable scrolling
		document.body.style = "overflow: hidden";
	}

	#hide = ()=> {
		this.dialog.setAttribute("inert", "");
		this.#animationOut();

		// enable scrolling
		document.body.removeAttribute("style");
	}

	#animationIn = ()=>{
		this.dialog.setAttribute("opening", "");
	}

	#animationOut = ()=>{
		this.dialog.removeAttribute("opening");
		setTimeout(()=> this.dialog.close(), parseInt(CSS.getValue("--transition-velocity")));
	}
};

window.customElements.define('x-modal', Modal);

// Make Modal Usable W/O Importing It
window.Modal = Modal;
