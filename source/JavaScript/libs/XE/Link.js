export default class Link extends HTMLElement{
	#href = null;

	constructor(){ super(); }

	connectedCallback(){ this.addEventListener("click", this.#event_handler_click); }

	disconnectedCallback(){ this.removeEventListener("click", this.#event_handler_click); }

	#event_handler_click(event){
		event.stopPropagation();
		this.#handle_go();
	}

	#handle_go(){
		if(this.hasAttribute("go") !== true) return;

		const parts = this.getAttribute("go").split(':', 2);

		switch (parts[0]) {
			case "URL":
				window.Hyperlink.locate(parts[1]);
				break;

			case "history":
				const res = Hyperlink.go_to_history(parts[1]);
				break;
		}
	}
};

window.customElements.define('x-link', Link);

window.x["Link"] = Link;
