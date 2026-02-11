// SVG shadow
// filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5));

export default class XSVG extends HTMLElement{
	constructor() {
		super();

		this.shadow = this.attachShadow({mode: 'closed'});

		this.shadow.innerHTML = `
			<style>
				:host{
					display: inline-block;
					vertical-align: middle;

					width: 100%;
					max-width: 1em;

					height: 1em;

					cursor: pointer;
					user-select: none;
				}

				span{
					width: 1em;
					height: 1em;

					& > svg{
						width: 1em;
						height: 1em;

						fill: ${this.getAttribute("color") || "var(--color-text-primary)"};

						transition: 100ms ease-in-out;
						transition-property: transform;

						&:hover{
							transform: scale(1.1);
						}

						&:active{
							transform: scale(0.5);
						}
					}
				}
			</style>

			<span>${window.SVG.use(this.getAttribute("name"))}</span>
		`;

		this.svg_container = this.shadow.querySelector("span");

		// Is Toggled?
		this.toggled = false;

		// On click toggle
		this.addEventListener("click", this.force_toggle);
	}

	////////// APIs

	force_toggle = ()=>{
		// If No "toggle" Attribute Then Exit The Method
		if (this.hasAttribute("toggle") === false) return;

		// Set SVG To "name" Value
		if (this.toggled === true) this.svg_container.innerHTML = window.SVG.use(this.getAttribute("name"));

		// Set SVG To "toggle" Value
		else this.svg_container.innerHTML = window.SVG.use(this.getAttribute("toggle"));

		// Update The Value
		this.toggled = !this.toggled;
	}

	////////// Setters
	// Set SVG name
	set_name(value) {
		this.setAttribute("name", value);
		if (this.toggled === false) this.svg_container.innerHTML = window.SVG.use(value);
	}

	// Set SVG toggle name
	set_toggle(value) {
		this.setAttribute("toggle", value);
		if (this.toggled === true) this.svg_container.innerHTML = window.SVG.use(value);
	}
};

window.customElements.define('x-svg', XSVG);

// Make XSVG Usable W/O Importing It
window.XSVG = XSVG;
