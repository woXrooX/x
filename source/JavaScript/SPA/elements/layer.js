export default class Layer extends HTMLElement {
    static init_nested_triggers(layer) {
		const x_layers = layer.querySelectorAll("[trigger_selector]");

		for (const x_layer of x_layers) {
			const selector = x_layer.getAttribute("trigger_selector");

			const nested_triggers = layer.querySelectorAll(selector);

			for (const nested_trigger of nested_triggers) {
				nested_trigger.onclick = (event) => {
					event.stopPropagation();

					// Find the corresponding x-layer inside the current layer
					const nested_layer = layer.querySelector(`x-layer[trigger_selector="${selector}"]`);
					if (!nested_layer) return;

					// Use the getContent method to get the original content
					const nested_content = nested_layer.getContent ? nested_layer.getContent() : "";

					Layers.init(nested_content, nested_trigger);
				};
			}
		}
	}

	getContent() { return this.#DOM; }

	#DOM = null;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'closed' });
		this.#DOM = this.innerHTML;

		this.#handle_trigger_click();
	}

	#handle_trigger_click = ()=> {
		const trigger_elements = document.querySelectorAll(this.getAttribute("trigger_selector"));
		if (!trigger_elements.length) return;

		for (const element of trigger_elements) element.onclick = (event) => Layers.init(this.#DOM, element);
	};
}

window.customElements.define('x-layer', Layer);

// Make Layer Usable W/O Importing It
window.Layer = Layer;

// export default class Layer extends HTMLElement {
// 	#DOM = null;

// 	constructor() {
// 		super();
// 		this.shadow = this.attachShadow({ mode: 'closed' });
// 		this.#DOM = this.innerHTML;
// 		this.#init_triggers();
// 	}

// 	#init_triggers = () =>{
// 		const button = document.querySelector(this.getAttribute("trigger_selector"));
// 		console.log(button);

// 		button.onclick = (event) => {
// 			event.stopPropagation();
// 			Layers.init(this.#DOM, button);
// 		};
// 	}
// }

// window.customElements.define('x-layer', Layer);
