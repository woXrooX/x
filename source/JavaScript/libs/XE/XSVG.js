// SVG shadow
// filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5));

export default class XSVG extends HTMLElement {
	/////////////////////////// Static

	/////////// Variables

	static observedAttributes = ["name", "toggle", "color"];


	/////////////////////////// Object

	/////////// Variables

	#toggled = false;
	#shadow = null;
	#svg_container = null;


	/////////// APIs

	constructor() {
		super();

		this.#shadow = this.attachShadow({mode: "closed"});

		this.#shadow.innerHTML = `
			<style>
				:host{
					display: inline-block;
					vertical-align: -0.125em;
					vertical-align: calc((1cap - 1em) / 2);

					cursor: pointer;
					user-select: none;
				}

				span{
					display: block;

					& > svg{
						display: block;
						width: 1em;
						height: 1em;

						fill: currentColor;

						transition: 100ms ease-in-out;
						transition-property: transform;

						&:hover{
							transform: scale(1.1);
						}

						&:active{
							transform: scale(0.9);
						}
					}
				}
			</style>

			<span></span>
		`;

		this.#svg_container = this.#shadow.querySelector("span");

		this.addEventListener("click", () => this.force_toggle());
	}

	attributeChangedCallback(attribute_name, old_value, new_value) {
		if (attribute_name === "color") this.#svg_container.style.color = new_value ?? '';

		else this.#render();
	}

	get_name() {
		return this.getAttribute("name");
	}

	set_name(value) {
		this.setAttribute("name", value);
	}

	get_toggle() {
		return this.getAttribute("toggle");
	}

	set_toggle(value) {
		this.setAttribute("toggle", value);
	}

	force_toggle() {
		if (this.hasAttribute("toggle") === false) return;

		this.#toggled = !this.#toggled;
		this.#render();
	}

	is_toggled() {
		return this.#toggled;
	}


	/////////// Helpers

	// Show the "toggle" icon when toggled, otherwise the "name" icon
	#render() {
		const attribute_name = this.#toggled === true ? "toggle" : "name";
		this.#svg_container.innerHTML = window.x.SVG.use(this.getAttribute(attribute_name));
	}
}

window.customElements.define("x-svg", XSVG);

// Make XSVG Usable W/O Importing It
window.XSVG = XSVG;
