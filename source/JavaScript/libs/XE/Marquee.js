export default class Marquee extends HTMLElement {

	#DOM = null;

	constructor() {
		super();

		this.#DOM = this.innerHTML;
		this.replaceChildren();
		this.insertAdjacentHTML("beforeend", `<div>${this.#DOM + this.#DOM}</div>`);
	}

	connectedCallback() {
		if (this.hasAttribute("x-marquee-animation-duration"))
			this.style.setProperty("--x-marquee-animation-duration", this.getAttribute("x-marquee-animation-duration"));
	}
}

window.customElements.define('x-marquee', Marquee);
