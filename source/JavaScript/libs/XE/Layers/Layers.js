import Layer from "./Layer.js";

export default class Layers{
	static selector = "body > x-layers";
	static #element = null;
	static #id = 0;
	static #FUNC_POOL = {};

	static {
		Layers.#element = document.querySelector(Layers.selector);
	}

	/////////// APIs
	static push_func(func){ Layers.#FUNC_POOL[func.name] = func; }

	static async add(DOM, func_name = null, data = null){
		Layers.#id += 1;

		if (Layers.#id === 1) window.x.Body.lock_scroll_y_axis();

		Layers.#element.insertAdjacentHTML("beforeend", Layer.build_DOM_HTML(Layers.#id, DOM));

		const container = Layers.#element.querySelector(`container#layer_${Layers.#id}`);

		// Clean up the layer adding effect
		container.addEventListener('animationend', () => container.classList.remove('adding'), { once: true });

		Layers.#build_remove_listener(Layers.#id);

		Layers.#execute_on_add(func_name, data, container.querySelector("layer > main"), Layers.#id);
	}

	static handle_commands(commands, type){
		console.log(commands, type);


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
			case "remove":
				Layers.#remove();
				break;

			default:
				Log.warning("Modal.handle_commands(): Invalid action");
				break;
		}
	}

	static #build_remove_listener(id){
		Layers.#element.querySelector(`container#layer_${id} > layer > x-svg`).addEventListener("click", () => Layers.#remove(id));
	}

	static #remove(id = null){
		// If no id provided, close the latest open layer
		if (id === null) id = Layers.#id;

		Layers.#id -= 1;

		if (Layers.#id === 0) window.x.Body.unlock_scroll_y_axis();

		const container = Layers.#element.querySelector(`container#layer_${id}`);

		container.classList.add('removing');

		container.addEventListener('animationend', () => container.remove(), { once: true });
	}

	static async #execute_on_add(func_name, data, layer_main_element, id){
		if (!!func_name === false) return;

		if (!(func_name in Layers.#FUNC_POOL)) return console.error(`Layers.#execute_on_add(): Invalid func_name: ${func_name}`);

		await Layers.#FUNC_POOL[func_name](data, layer_main_element, id);
	}
};

window.x["Layers"] = Layers;
