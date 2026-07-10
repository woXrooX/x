export default class Post {
	/////////////////////////// Object

	#element;
	#for;
	#data;
	#trigger;
	#commands;
	#action = null;
	#source = "";
	#target;
	#response;

	#input_elements = {
		// "name": {
		// 	"element": element,
		// 	"value": element_value
		// }
	};

	#instructions = [
		// {
		// 	"types": [],
		// 	"action": [],
		// 	"source": ""
		// }
	];

	constructor(element) {
		this.#element = element;
		this.#element.style.cursor = "pointer";
		this.#target = this.#element.getAttribute("XR-target") ? document.querySelector(this.#element.getAttribute("XR-target")) : this.#element;

		this.#construct_data();
		this.#handle_trigger();
		this.#parse_commands();
	}

	#construct_data() {
		try{ this.#data = JSON.parse(this.#element.getAttribute("XR-data")); }
		catch(error) { this.#data = {}; }

		this.#data = {
			...(this.#element.hasAttribute("XR-for") ? {"for": this.#element.getAttribute("XR-for")} : {}),
			...this.#data
		}
	}

	/////////// Handlers

	#handle_input_elements() {
		if (this.#element.hasAttribute("XR-inputs") === false) return;

		const parts = this.#element.getAttribute("XR-inputs").split(',');

		for (let index = 0; index < parts.length; index++) {
			parts[index] = parts[index].trim();
			if (parts[index] == '') continue;

			const input_element = document.querySelector(parts[index]);
			if (!input_element) continue;

			const input_element_name = get_name(input_element);
			if (input_element_name === false || input_element_name === '') continue;

			const input_element_value = get_value(input_element);

			this.#input_elements[input_element_name] = {
				"element": input_element,
				"value": input_element_value
			}
		}

		// Overriding this.#data with XR-inputs values
		for (const name in this.#input_elements) this.#data[name] = this.#input_elements[name].value;

		function get_name(element) {
			if ("name" in element) return element.name;
			if (element.hasAttribute("name")) return element.getAttribute("name");

			return false;
		}

		function get_value(element) {
			if ("value" in element) return element.value;
			if (element.hasAttribute("value")) return element.getAttribute("value");

			return element.innerText;
		}
	}

	#handle_trigger() {
		this.#trigger = this.#element.getAttribute("XR-trigger") ?? "click";

		switch(this.#trigger) {
			case "click":
				this.#on_click();
				break;

			default:
				this.#on_click();
				break;
		}
	}

	#parse_commands() {
		this.#commands = this.#element.getAttribute("XR-commands");

		if (!!this.#target === false) return;
		if (!!this.#commands === false) return;

		const commands = split_commands(this.#commands);

		for (const command of commands) {
			const parts = command.split(':');

			// Invalid command
			if (parts.length !== 4) continue;

			this.#instructions.push({
				"types": parts[1].split('|'),
				"action": parts[2],
				"source": parts[3]
			});
		}

		function split_commands(commands_string) {
			const matches = commands_string.match(/on:(?:[^"\s]|"[^"]*")+/g) || [];
			const result = [];

			for (let i = 0; i < matches.length; i++) result.push(matches[i].replace(/"([^"]*)"/g, '$1'));

			return result;
		}
	}

	#handle_commands() {
		if (!("type" in this.#response)) return;

		for (const instruction of this.#instructions) {
			if (instruction["types"].includes("any") || instruction["types"].includes(this.#response["type"])) {
				if (instruction["source"] === "data") this.#source = this.#response["data"] || '';
				else if (instruction["source"] === "message") this.#source = window.Lang.use(this.#response["message"]);
				else this.#source = instruction["source"];

				this.#action = instruction["action"];

				this.#handle_actions();

				break;
			}
		}
	}

	#handle_actions() {
		if (!!this.#action === false) return;

		if (this.#action === "innerHTML") this.#target.innerHTML = this.#source;
		else if (this.#action === "outerHTML") this.#target.outerHTML = this.#source;
		else if (this.#action === "replaceWith") this.#target.replaceWith(this.#source);
		else if (this.#action.startsWith("setAttribute")) this.#handle_set_attribute();
	}

	#handle_set_attribute() {
		let arr = this.#action
			.slice(
				this.#action.indexOf("[")+1,
				this.#action.indexOf("]")
			)
			.split(',');

		if (arr.length > 0) this.#target.setAttribute(arr[0], this.#source ?? arr[1] ?? '');
	}

	#handle_response() {
		////////// Callback
		window.x.XR.execute_on_response(
			this.#element.getAttribute("XR-func"),
			this.#response,
			this.#data,
			this.#element
		);

		if ("field" in this.#response) {
			let field_element = null;

			if (this.#response["field"] in this.#input_elements) field_element = this.#input_elements[this.#response["field"]]["element"];
			else field_element = document.querySelector(this.#response["field"]);

			if (!!field_element === true) {
				x.VFX.border_flash(field_element, this.#response["type"]);
				x.VFX.shake(field_element);
			}
		}

		////////// x-toast
		x.Toast.handle_commands(this.#element.getAttribute("x-toast"), this.#response);

		////////// x-modal
		Modal.handle_commands(this.#element.getAttribute("x-modal"), this.#response["type"]);

		////////// x-layers
		x.Layers.handle_commands(this.#element.getAttribute("x-layer"), this.#response["type"]);

		////////// this.#response["actions"]
		window.x.Response.handle_actions(this.#response);
	}

	/////////// Event listeners

	#on_click() {
		this.#element.onclick = async ()=>{
			Loading.on_element_start(this.#element);

			this.#handle_input_elements();

			window.Modal.lock();

			this.#response = await window.x.Request.make({
				payload: this.#data,
				target_URL: this.#element.getAttribute("XR-post")
			});

			window.Modal.unlock();

			if (!("type" in this.#response)) return x.Toast.new("error", "invalid_response");
			else this.#handle_response();

			this.#handle_commands();

			Loading.on_element_end(this.#element);
		};
	}
}
