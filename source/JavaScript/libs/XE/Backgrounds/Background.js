// Usage:
// <x-background>
// {
	// "version": 1,
	// "parent_selector": "container.x_background_1",
	// "z_index": -1
// }
// </x-background>

export default class Background extends HTMLElement {
	#canvas = null;
	#ctx = null;

	#JSON = {};

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "closed" });
		this.#JSON = JSON.parse(this.innerHTML).constructor === Object ? JSON.parse(this.innerHTML) : {};
		this.replaceChildren();

		this.shadow.innerHTML = `
			<style>
				:host{
					pointer-events: none;

					display: block;
					width: 100%;
					height: 100%;
					max-width: 100dvw;
					max-height: 100dvh;
				}
			</style>
			<canvas></canvas>
			<div></div>
		`;

		this.#style_parent_element();
		this.#init_canvas();
		this.#load_version_file();
	}

	#style_parent_element = ()=>{
		if (!( "parent_selector" in this.#JSON)) return;

		const parent_element = document.querySelector(this.#JSON["parent_selector"]);

		if (!parent_element) return;

		this.shadow.querySelector('style').textContent += `
			:host{
				position: absolute;
				inset: 0;
				${"z_index" in this.#JSON ? `z-index: ${this.#JSON["z_index"]};` : ''}
			}
		`;

		parent_element.style = `
			position: relative;
			overflow: hidden;
		`;
	}

	#init_canvas = ()=>{
		this.#canvas = this.shadow.querySelector("canvas");
		this.#ctx = this.#canvas.getContext("2d");

		// Set initial canvas size
		this.#canvas.width = window.innerWidth;
		this.#canvas.height = window.innerHeight;

		// Set canvas size on resize
		window.addEventListener('resize', () => {
			this.#canvas.width = window.innerWidth;
			this.#canvas.height = window.innerHeight;
		});
	}

	#load_version_file = async ()=>{
		try {
			const module = await import(`./versions/Version_${this.#JSON["version"]}.js`);
			module.default.init(this.#canvas, this.#ctx);
		}

		catch (error) {
			console.warn(`Background: ${error}`);
		}
	}
}

window.customElements.define('x-background', Background);
