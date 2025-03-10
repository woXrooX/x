export default class Layers{
	static selector = "body > x-layers";
	static #main_element = null;

	static { Layers.#main_element = document.querySelector(Layers.selector); }

	static init(DOM, trigger_element){
		// Disable the button after triggered
		trigger_element.disabled = true;

		// Create a cover and layer
		const cover = document.createElement("cover");
		const layer = document.createElement("layer");

		// Insert
		layer.innerHTML = `
			<x-svg class="btn btn-primary btn-s" for="layer_close" name="x" color="ffffff"></x-svg>
			${DOM}
		`;

		// Append
		Layers.#main_element.appendChild(cover);
		Layers.#main_element.appendChild(layer);

		Layers.show(cover, layer);
		Layers.hide(cover, layer, trigger_element);

		Layer.init_nested_triggers(layer);
	}

	static show(cover, layer){
		// Small delay to trigger CSS transitions
		setTimeout(() => {
			cover.classList.add("show");
			layer.classList.add("show");
		}, 10);
	}

	static hide(cover, layer, trigger_element){
		layer.querySelector("x-svg[for=layer_close]").onclick = () => {
			trigger_element.disabled = false;

			// Exit layer animation
			layer.classList.add("closed");
			cover.classList.add("closed");

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
