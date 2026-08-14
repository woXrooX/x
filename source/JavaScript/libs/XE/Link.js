export default class Link extends HTMLElement{
	#parts = null;

	constructor() { super(); }

	connectedCallback() {
		if(this.hasAttribute("go") !== true) return;

		this.#parse_commands();
		this.#validate_can_go_to_history();

		this.addEventListener("click", this.#event_handler_click);
	}

	disconnectedCallback() { this.removeEventListener("click", this.#event_handler_click); }

	#event_handler_click(event) {
		event.stopPropagation();

		switch (this.#parts[0]) {
			case "URL":
				Hyperlink.locate(this.#parts[1]);
				break;

			case "history":
				const res = Hyperlink.go_to_history(this.#parts[1]);
				break;
		}
	}

	#parse_commands() {
		this.#parts = this.getAttribute("go").split(':', 2);
	}

	#validate_can_go_to_history() {
		if (this.#parts[0] != "history") return;
		if (Hyperlink.can_go_to_history(this.#parts[1]) === false) this.classList.add("display-none");
	}
};

window.customElements.define('x-link', Link);

window.x["Link"] = Link;
