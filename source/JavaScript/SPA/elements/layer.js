export default class Layer extends HTMLElement {
    static #container_selector = "body > layers";
    static #container = null;

	static #init_layers(DOM, trigger_element) {
		trigger_element.disabled = true;

		// Create the new layer
		const layer = document.createElement("layer");
		layer.innerHTML = `
			<column class="gap-2 padding-2">
				<x-svg class="btn btn-primary btn-s" for="layer_close" name="x" color="ffffff"></x-svg>
				${DOM}
			</column>
		`;

		// Create a cover
		const cover = document.createElement("cover");

		// Append cover first, then the layer
		Layer.#container.appendChild(cover);
		Layer.#container.appendChild(layer);

		// Add show class after a small delay to trigger CSS transitions
		setTimeout(() => {
			cover.classList.add("show");
			layer.classList.add("show");
		}, 10);

		// Handle close layer
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

		// Initialize nested triggers
		Layer.#init_nested_triggers(layer);
	}

    static #init_nested_triggers(layer) {
        const triggers = layer.querySelectorAll("[trigger_selector]");
        for (const trigger of triggers) {
            const selector = trigger.getAttribute("trigger_selector");
            const nested_triggers = layer.querySelectorAll(selector);

            for (const nested_trigger of nested_triggers) {
                nested_trigger.onclick = (event) => {
                    // Prevent triggering parent layers
                    event.stopPropagation();

                    // Find the corresponding x-layer inside the current layer
                    const nested_layer = layer.querySelector(`x-layer[trigger_selector="${selector}"]`);
                    if (!nested_layer) return;

                    // Use the getContent method to get the original content
                    const nested_content = nested_layer.getContent ? nested_layer.getContent() : "";

                    Layer.#init_layers(nested_content, nested_trigger);
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
        Layer.#container = document.querySelector(Layer.#container_selector);
        this.replaceChildren();

        this.#handle_trigger_click();
    }

    #handle_trigger_click = ()=> {
        const triggers = document.querySelectorAll(this.getAttribute("trigger_selector"));
        if (!triggers.length) return;

        for (const trigger of triggers) {
            trigger.onclick = (event) => {
                // Prevent triggering parent layers
                event.stopPropagation();
                Layer.#init_layers(this.#DOM, trigger);
            };
        }
    };
}

window.customElements.define('x-layer', Layer);

// Make Layer Usable W/O Importing It
window.Layer = Layer;
