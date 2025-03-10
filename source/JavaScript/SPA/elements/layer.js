export default class Layer extends HTMLElement {
	static handle_nested_triggers(layer) {
		const x_layers = layer.querySelectorAll("x-layer");

		for (const x_layer of x_layers) {
			const selector = x_layer.getAttribute("trigger_selector");
			const trigger_element = layer.querySelector(selector);

			trigger_element.onclick = (event) => {
				event.stopPropagation();

				const targeted_layer = layer.querySelector(`x-layer[trigger_selector="${selector}"]`);
				if (!!targeted_layer === false) return;

				Layers.build_layer(targeted_layer.innerHTML, trigger_element);
			};
		}
	}

	#DOM = null;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'closed' });
		this.#DOM = this.innerHTML;

		this.#handle_trigger_click();
	}

	#handle_trigger_click = ()=> {
		const trigger_element = document.querySelector(this.getAttribute("trigger_selector"));
		if(!!trigger_element === false) return;

		trigger_element.onclick = ()=> Layers.build_layer(this.#DOM, trigger_element);
	};
}

window.customElements.define('x-layer', Layer);

// Make Layer Usable W/O Importing It
window.Layer = Layer;
