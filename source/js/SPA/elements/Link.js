export default class Link extends HTMLElement{
	#href = null;

	constructor(){ super(); }

	connectedCallback(){
		if(this.hasAttribute("href") !== true) return;
		this.#href = this.getAttribute("href");
		this.addEventListener("click", this.#handle_click);
	}

	disconnectedCallback(){ this.removeEventListener("click", this.#handle_click); }

	#handle_click(event){
		event.stopPropagation();
		window.Hyperlink.locate(this.#href);
	}
};

window.customElements.define('x-link', Link);

window.x["Link"] = Link;
