export default class Layer extends HTMLElement{
	static #container_selector = "body > layers";
	static #container = null;
	static #id = 0;

	static {
		Layer.#container = document.querySelector(Layer.#container_selector);
	}

	/////////////// x-layer object
	#DOM = null;

	constructor(){
		Layer.#id++;

		super();
		this.shadow = this.attachShadow({mode: 'closed'});
		this.#DOM = this.innerHTML;
		this.replaceChildren();

		CSS: {
			const style = document.createElement('style');
			style.textContent = `:host {display: none;}`;
			this.shadow.appendChild(style);
		}

		Layer.#container.innerHTML += `<layer id="layer_${Layer.#id}">${this.#DOM}</layer>`;
	}
};

window.customElements.define('x-layer', Layer);

window.Layer = Layer;

			/* <x-layer>
				<column class="flex-x-center h-100">
					Layer One
				</column>
			</x-layer> */
