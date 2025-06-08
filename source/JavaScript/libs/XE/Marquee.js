export default class Marquee extends HTMLElement {

	#DOM = null;

	constructor() {
		super();

		this.#DOM = this.innerHTML;
		this.replaceChildren();
		this.insertAdjacentHTML("beforeend", `<div>${this.#DOM + this.#DOM}</div>`);
	}

	connectedCallback() {
		if (this.getAttribute('direction') === 'right') this.querySelector('div').style.animationDirection = 'reverse';
		if (this.getAttribute("duration")) this.style.setProperty('--x-marquee-animation-duration', `${this.getAttribute("duration")}s`);
	}
}

window.customElements.define('x-marquee', Marquee);
