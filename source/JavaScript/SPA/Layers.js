export default class Layers{
	static selector = "body > x-layers";
	static #element = null;
	static layers_container = null;
	static #id = 0;
	static #FUNC_POOL = {};

	static {
		Layers.#element = document.querySelector(Layers.selector);
	}

	/////////// APIs
	static push_func(func){ Layers.#FUNC_POOL[func.name] = func; }

	static add(DOM, func_name = null, data = null){
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

		// Layers.layers_container = Layers.#element.querySelector(`container#layer_${Layers.#id}`);

		// Clean up the layer adding effect
		Layers.layers_container.addEventListener('animationend', () => Layers.layers_container.classList.remove('adding'), { once: true });

		Layers.#build_remove_listener(Layers.#id);

		Layers.#execute_on_add(func_name, data);

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

	static async #execute_on_add(func_name, data = null){
		if(!!func_name === false) return;
		await Layers.#FUNC_POOL[func_name](data);
	}
};

window.x["Layers"] = Layers;
