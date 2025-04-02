export default class Tooltip extends HTMLElement {
	static #id = 0;

	constructor() {
		super();

		Tooltip.#id += 1;

		this.anchor_name = `--anchor-${Tooltip.#id}`;
	}

	connectedCallback() {
		const trigger_element = document.querySelector(this.getAttribute('trigger_selector'));

		if (!trigger_element) return;

		trigger_element.style.anchorName = this.anchor_name;

		// Set positioning styles
		this.style = `
			position-anchor: ${this.anchor_name};
		`;


		trigger_element.addEventListener('mouseenter', () => this.classList.add("show"));

		trigger_element.addEventListener('mouseleave', () => {
			this.classList.remove('show');
		});
	}
};

customElements.define('x-tooltip', Tooltip);

window.x["Tooltip"] = Tooltip;
