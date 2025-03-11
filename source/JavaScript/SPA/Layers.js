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

		Layers.#element.insertAdjacentHTML("beforeend", `
			<container id="layer_${Layers.#id}" class="adding">
				<cover></cover>
				<layer class="surface-v1">
					<x-svg class="btn btn-primary btn-s" for="layer_remove" name="x" color="ffffff"></x-svg>
					<main>${DOM}</main>
				</layer>
			</container>
		`);

		// Clean up the layer adding effect
		const container = Layers.#element.querySelector(`container#layer_${Layers.#id}`);
		container.addEventListener('animationend', () => {
			container.classList.remove('adding');
		}, { once: true });

		Layers.#build_remove_listener(Layers.#id);
	}


	/////////// Helpers

	static #build_remove_listener(id){
		Layers.#element.querySelector(`container#layer_${id} > layer > x-svg`).addEventListener("click", ()=>{
			Layers.#remove(id);
		});
	}

	static #remove(id){
		Layers.#id -= 1;

		const container = Layers.#element.querySelector(`container#layer_${id}`);

		container.classList.add('removing');

		container.addEventListener('animationend', () => {
			container.remove();
		}, { once: true });
	}
};

window.x["Layers"] = Layers;
