// XF = x form = Custom form handler
export default class XF{
	/////////// APIs
	static async handle({
		_for,
		url = null,
		root_element,
		submitter_element,
		keys = [],
		Toast_commands = false,
		Modal_commands = false,
		Layer_commands = false
	}){
		if (!!_for === false) return;
		if (!!url === false) url = window.location.href;
		if (!!root_element === false) return;
		if (!!submitter_element === false) return;
		if (!Array.isArray(keys)) return;

		const validated_keys = {};
		const form_data = { "for": _for };

		submitter_element.onclick = async ()=>{
			submitter_element.disabled = true;

			// Map the elements, values to keys
			for (let index = 0; index < keys.length; index++) {
				const element = root_element.querySelector(`[XF_key=${keys[index]}]`);
				if (!!element === false) continue;

				validated_keys[keys[index]] = {
					"element": element,
					"value": XF.#get_value(element)
				};
			}

			// Prepare the data for BE
			for (const key in validated_keys) form_data[key] = validated_keys[key]["value"];

			const response = await window.bridge(form_data, url);

			XF.#handle_response(
				response,
				validated_keys,
				Toast_commands,
				Modal_commands,
				Layer_commands
			);

			submitter_element.disabled = false;

			return response;
		};
	}

	/////////// Helpers
	static #get_value(element){
		if ("XF_value" in element) return element.XF_value;
		if (element.hasAttribute("XF_value")) return element.getAttribute("XF_value");
		if ("value" in element) return element.value;
	}

	static #handle_response(
		response,
		keys,
		Toast_commands,
		Modal_commands,
		Layer_commands
	){
		if (!("type" in response)) return x.Toast.new("error", Lang.use("invalid_response"));

		if ("field" in response) {
			x.Toast.new(response["type"], Lang.use(response["message"]));
			x.VFX.border_flash(keys[response["field"]]["element"], response["type"]);
			x.VFX.shake(keys[response["field"]]["element"]);

			return;
		}

		if (response["type"] == "error") return x.Toast.new("error", Lang.use(response["message"]));

		////////// x-toast
		x.Toast.handle_commands(Toast_commands, response);

		////////// x-modal
		window.Modal.unlock();
		Modal.handle_commands(Modal_commands, response["type"]);

		////////// x-layers
		x.Layers.handle_commands(Layer_commands, response["type"]);

		////////// response["actions"]
		x.Response.handle_actions(response);
	}
}

x["XF"] = XF;
