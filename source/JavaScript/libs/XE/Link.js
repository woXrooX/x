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
				handle_URL(parts[1]);
				break;

			case "history":
				handle_history(parts[1]);
				break;
		}

		function handle_URL(URL){
			if(!!URL === false) return false;
			window.Hyperlink.locate(URL);
		}

		function handle_history(history){
			if(!!history === false) return false;

			switch (history) {
				case "back":
					window.history.back();
					break;

				case "forth":
					window.history.forward();
					break;

				default:
					window.history.go(parseInt(history));
					break;
			}
		}
	}
};

window.customElements.define('x-link', Link);

window.x["Link"] = Link;
