export default class Layers{
	static selector = "body > x-layers";
	static #element = null;
	static #id = 0;

	static {
		Layers.#element = document.querySelector(Layers.selector);
	}

	/////////// APIs

	static add(DOM){
		Layers.#id += 1;

		if(Layers.#id === 1) window.x.Body.lock_scroll_y_axis();

		Layers.#element.insertAdjacentHTML("beforeend", `
			<container id="layer_${Layers.#id}" class="adding">
				<cover></cover>
				<layer class="surface-v1 overflow-hidden">
					<x-svg
						class="
							btn	btn-primary btn-s

							position-fixed
							top-5px
							right-5px
						"
						for="layer_remove"
						name="x"
						color="ffffff"
					></x-svg>
					<main
						class="
							width-100 height-100
							padding-1
							overflow-y-scroll
						"
					>${DOM}</main>
				</layer>
			</container>
		`);

		// Clean up the layer adding effect
		const container = Layers.#element.querySelector(`container#layer_${Layers.#id}`);

		container.addEventListener('animationend', () => container.classList.remove('adding'), { once: true });

		Layers.#build_remove_listener(Layers.#id);
	}


	/////////// Helpers

	static #build_remove_listener(id){
		Layers.#element.querySelector(`container#layer_${id} > layer > x-svg`).addEventListener("click", () => Layers.#remove(id));
	}

	static #remove(id){
		Layers.#id -= 1;

		if(Layers.#id === 0) window.x.Body.unlock_scroll_y_axis();

		const container = Layers.#element.querySelector(`container#layer_${id}`);

		container.classList.add('removing');

		container.addEventListener('animationend', () => container.remove(), { once: true });
	}
};

window.x["Layers"] = Layers;
