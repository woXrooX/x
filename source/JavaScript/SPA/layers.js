export default class Layers{
	static selector = "body > x-layers";
	static #container = null;

	static { Layers.#container = document.querySelector(Layers.selector); }

	static init(DOM, trigger_element){
		// Disable the button after triggered
		trigger_element.disabled = true;

		// Create a cover and layer
		const cover = document.createElement("cover");
		const layer = document.createElement("layer");

		// Insert
		layer.innerHTML = `export default class Layer extends HTMLElement {
	#DOM = null;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'closed' });
		this.#DOM = this.innerHTML;
		this.#init_triggers();
	}

	#init_triggers = () =>{
		const button = document.querySelector(this.getAttribute("trigger_selector"));
		console.log(button);

		button.onclick = (event) => {
			event.stopPropagation();
			Layers.init(this.#DOM, button);
		};
	}
}

window.customElements.define('x-layer', Layer);
			<x-svg class="btn btn-primary btn-s" for="layer_close" name="x" color="ffffff"></x-svg>
			${DOM}
		`;

		// Append
		Layers.#container.appendChild(cover);
		Layers.#container.appendChild(layer);

		Layers.show(cover, layer);
		Layers.hide(cover, layer, trigger_element);

		Layer.init_nested_triggers(layer);
	}

	static show(cover, layer){
		// Add show class after a small delay to trigger CSS transitions
		setTimeout(() => {
			cover.classList.add("show");
			layer.classList.add("show");
		}, 10);
	}

	static hide(cover, layer, trigger_element){
		layer.querySelector("x-svg[for=layer_close]").onclick = () => {
			trigger_element.disabled = false;

			// Exit layer animation
			layer.classList.add("closing");
			cover.classList.add("closing");

			// Remove after animation
			setTimeout(() => {
				cover.remove();
				layer.remove();
			}, 400);
		};
	}
};

// Make Layers Usable W/O Importing It
window.Layers = Layers;
