export default class Marquee extends HTMLElement {

	#DOM = null;

	constructor() {
		super();

		this.#DOM = this.innerHTML;
		this.replaceChildren();
		this.insertAdjacentHTML("beforeend", `<div>${this.#DOM + this.#DOM}</div>`);
	}

	connectedCallback() {
		// const classes = this.getAttribute("class");

		// this.#DOM = this.innerHTML;
		// this.replaceChildren();
		// this.insertAdjacentHTML("beforeend", `<row class="${classes}">${this.#DOM + this.#DOM}</row>`);


	}
}

window.customElements.define('x-marquee', Marquee);
