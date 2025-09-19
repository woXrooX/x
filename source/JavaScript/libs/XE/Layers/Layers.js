import Layer from "./Layer.js";

export default class Layers{
	static DATA = {};
	static selector = "body > x-layers";

	static #element = null;

	// Active layer ID
	static #id = 0;

	static #FUNC_POOL = {};

	static {
		Layers.#element = document.querySelector(Layers.selector);
	}

	/////////// APIs
	static push_func(func){ Layers.#FUNC_POOL[func.name] = func; }

	static async push(
		DOM,
		layer_func_execute_on_push = null,
		layer_func_execute_on_activated = null,
		layer_data = null
	){
		Layers.#id += 1;

		if (Layers.#id === 1) window.x.Body.lock_scroll_y_axis();

		Layers.#element.insertAdjacentHTML("beforeend", Layers.#build_from_template_HTML(
			Layers.#id,
			DOM,
			layer_func_execute_on_push,
			layer_func_execute_on_activated,
			layer_data
		));

		const container = Layers.#element.querySelector(`container#layer_${Layers.#id}`);
		if (container === null) return;

		// Clean up the layer adding effect
		container.addEventListener('animationend', () => container.classList.remove('adding'), { once: true });

		Layers.#build_pop_listener(Layers.#id);

		Layers.#execute_func_on(
			container.getAttribute("layer_func_execute_on_push"),
			container.getAttribute("layer_data"),
			container.querySelector("layer > main"),
			Layers.#id
		);
	}

	static pop(){
		Popping_Layer: {
			const container = Layers.#element.querySelector(`container#layer_${Layers.#id}`);
			if (container === null) return;

			container.classList.add('removing');
			container.addEventListener('animationend', () => container.remove(), { once: true });
		}

		Layers.#id -= 1;

		if (Layers.#id === 0) {
			Layers.DATA = {};
			window.x.Body.unlock_scroll_y_axis();
			return;
		}

		Activating_Layer: {
			const container = Layers.#element.querySelector(`container#layer_${Layers.#id}`);
			if (container === null) return;

			Layers.#execute_func_on(
				container.getAttribute("layer_func_execute_on_activated"),
				container.getAttribute("layer_data"),
				container.querySelector("layer > main"),
				Layers.#id
			);
		}
	}

	static handle_commands(commands, type){
		if(!!commands === false) return;
		if(!!type === false) return;

		const instructions = Layers.#parse_commands(commands);

		for(const instruction of instructions){
			if(instruction["types"].includes("any") || instruction["types"].includes(type)){
				Layers.#handle_command_action(instruction["action"]);
				break;
			}
		}
	}

	/////////// Helpers

	static #build_from_template_HTML(
		id,
		DOM,
		layer_func_execute_on_push,
		layer_func_execute_on_activated,
		layer_data
	){
		return `
			<container
				id="layer_${id}"

				class="adding"

				${layer_func_execute_on_push ? `layer_func_execute_on_push="${layer_func_execute_on_push}"` : ''}
				${layer_func_execute_on_activated ? `layer_func_execute_on_activated="${layer_func_execute_on_activated}"` : ''}
				${layer_data ? `layer_data="${layer_data}"` : ''}
			>
				<cover></cover>
				<layer class="surface-v1 overflow-hidden">
					<x-svg
						class="
							btn	btn-primary btn-s

							position-fixed
							top-5px
							right-5px
						"

						for="layer_pop"

						name="x"
						color="ffffff"
					></x-svg>
					<main
						class="
							overflow-y-scroll
							width-100
							height-100
							padding-top-2rem
						"
					>${DOM}</main>
				</layer>
			</container>
		`;
	}

	static #parse_commands(commands){
		const instructions = [];

		commands = commands.split(' ');

		for(const command of commands){
			const parts = command.split(':');

			// Invalid command
			if(parts.length !== 3) continue;

			instructions.push({
				"types": parts[1].split('|'),
				"action": parts[2]
			});
		}

		return instructions;
	}

	static #handle_command_action(command){
		switch(command){
			case "pop":
				Layers.pop();
				break;

			default:
				Log.warning("Modal.handle_commands(): Invalid action");
				break;
		}
	}

	static #build_pop_listener(id){
		Layers.#element.querySelector(`container#layer_${id} > layer > x-svg[for=layer_pop]`).addEventListener("click", () => Layers.pop());
	}

	static async #execute_func_on(
		func_name,
		layer_data,
		layer_main_element,
		id
	){
		if (!!func_name === false) return;
		if (!(func_name in Layers.#FUNC_POOL)) return console.error(`Layers.#execute_on_add(): Invalid func_name: ${func_name}`);
		await Layers.#FUNC_POOL[func_name](layer_data, layer_main_element, id);
	}
};

window.x["Layers"] = Layers;
