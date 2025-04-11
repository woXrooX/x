export default class Tooltip extends HTMLElement {
	/////////////////////////// Static

	static #id = 0;

	/////////////////////////// Object

	#anchor_name = '';
	#trigger_element = null;
	#event_handler_click_outside_close = null;

	/////////// APIs

	constructor() {
		super();
		Tooltip.#id += 1;
		this.#anchor_name = `--anchor-${Tooltip.#id}`;
	}

	connectedCallback() {
		this.#setup_this_element();
		this.#setup_trigger_element();
		this.#handle_trigger();
	}

	disconnectedCallback() {
		if (this.#event_handler_click_outside_close) document.removeEventListener('click', this.#event_handler_click_outside_close);
	}

	/////////// Helpers

	#setup_trigger_element(){
		this.#trigger_element = document.querySelector(this.getAttribute('trigger_selector'));
		this.#trigger_element.style = `anchor-name: ${this.#anchor_name};`;
	}

	#setup_this_element(){
		this.style = `position-anchor: ${this.#anchor_name};`;
	}

	#handle_trigger = ()=>{
		if (!this.#trigger_element) return false;

		switch (this.getAttribute("trigger_type")){
			case "hover":
				this.#handle_trigger_hover();
				break;

			case "click":
				this.#handle_trigger_click();
				break;

			// case "auto":
			// 	this.#handle_trigger_auto();
			// 	break;

			default:
				this.#handle_trigger_hover();
				break;
		}
	};

	#handle_trigger_hover = ()=>{
		this.#trigger_element.addEventListener('mouseenter', () => this.classList.add("show"));
		this.#trigger_element.addEventListener('mouseleave', () => this.classList.remove('show'));
	};

	#handle_trigger_click = ()=>{
		this.#trigger_element.addEventListener("click", (event) => {
			// Prevent the click from immediately closing the tooltip
			event.stopPropagation();

			// Re-clicking on the trigger_element serves as close tooltip as well
			this.classList.toggle("show");
		});

		// Document-level click handler to close tooltip when clicking outside
		this.#event_handler_click_outside_close = (event) => {
			if (
				this.classList.contains("show") &&
				!this.contains(event.target) &&
				!this.#trigger_element.contains(event.target)
			) this.classList.remove("show");
		};

		document.addEventListener('click', this.#event_handler_click_outside_close);
	};
};

customElements.define('x-tooltip', Tooltip);

window.x["Tooltip"] = Tooltip;
