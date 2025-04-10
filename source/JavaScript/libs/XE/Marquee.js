export default class Marquee extends HTMLElement {

	#DOM = null;

	constructor() {
		super();

		this.#DOM = this.innerHTML;
		this.replaceChildren();
		this.insertAdjacentHTML("beforeend", `<row class="${this.getAttribute("class") || "gap-1"}">${this.#DOM + this.#DOM}</row>`);
	}
}

window.customElements.define('x-marquee', Marquee);
