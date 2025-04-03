export default class Urgent extends HTMLElement{
	constructor(){
		super();

		// Save the DOM
		this.DOM = this.innerHTML;

		// Structure
		this.innerHTML = `
			<dialog inert>
				<button><x-svg name="x" color="ffffff"></x-svg></button>
				<main>${this.DOM}</main>
			</dialog>
			<trigger></trigger>
		`;

		this.dialog = this.querySelector("dialog");
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
						content = `<x-svg name="${value}"></x-svg>`;
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
		setTimeout(()=> this.dialog.close(), parseInt(x.CSS.get_value("--transition-velocity")));
	}
};

window.customElements.define('x-urgent', Urgent);

window.Urgent = Urgent;
