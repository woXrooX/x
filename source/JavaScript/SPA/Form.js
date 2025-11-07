export default class Form{
	static #FUNC_POOL = {};
	static #flash_duration = 2000;
	static #to_be_observed = [];

	/////////// APIs
	static collect(element = null){
		// Log.info(`Form.collect()`);

		if(!!element === false) element = document;

		Form.#unregister_all();

		const forms = element.querySelectorAll('form');

		for(const form of forms){
			if(Form.#form_guard(form) === false) continue;

			Form.register(form);
		}
	}

	static register(form){
		Log.info(`Form.register()`);

		// Enable events listeners
		// Form.#on_input(form);
		form.addEventListener("submit", Form.#on_submit, true);

		Form.#to_be_observed.push(form);
	}

	static #unregister_all(){
		// Clean up the old listeners
		for(const form of Form.#to_be_observed) form.removeEventListener('submit', Form.#on_submit, true);

		// Clear the array after removing listeners
		Form.#to_be_observed = [];
	}

	static push_func(func){ Form.#FUNC_POOL[func.name] = func; }

	/////////// Helpers
	static #on_input(form){
		// check if on_input mode is enabled
		if(!form.hasAttribute("oninputcheck")) return;

		form.querySelectorAll("label > input").forEach((input) => {
			input.oninput = async ()=>{
				let data = {
					for: form.getAttribute("for"),
					field: event.target.name,
					fields: {}
				}

				data["fields"][event.target.name] = event.target.value;

				let response = await window.x.Request.make(data, `${form.getAttribute("for")}`);
				if("field" in response) Form.#response(response["field"], response["type"], response["message"]);
			};
		});
	}

	static async #on_submit(event){
		event.preventDefault();

		const submitter = event.submitter;

		// Disable submitter button
		submitter.disabled = true;

		window.Modal.lock();

		// PLZW8
		Form.#response({
			form: event.target,
			type: "info",
			message: "plzW8",
			field: event.target.getAttribute("for")
		});

		let form_data = new FormData(event.target);

		form_data.append("for", event.target.getAttribute("for"));

		// DEV: Log FormData
		// for(const [key, value] of form_data.entries()) console.log(`${key}: ${value}`);

		let response = await window.x.Request.make(form_data, event.target.action, event.target.enctype);

		// DEV: Data from Back-End
		// Log.info(response);

		// On invalid response
		if(Form.#response_guard(response) === false){
			Form.#response({
				form: event.target,
				type: "error",
				message: window.Lang.use("invalid_response"),
				field: event.target.getAttribute("for")
			});

			// Enable Submitter Button
			submitter.disabled = false;

			return;
		}

		// Flash above input field
		if("field" in response)
			Form.#response({
				form: event.target,
				type: response["type"],
				field: response["field"],
				border_flash: true,
				shake: true
			});

		// Text above submit field
		Form.#response({
			form: event.target,
			type: response["type"],
			message: response["message"],
			field: event.target.getAttribute("for")
		});

		// Enable submitter button
		submitter.disabled = false;

		////////// Callback
		Form.#execute_on_response(event.target.getAttribute("form_func"), response, form_data);

		////////// x-toast
		x.Toast.handle_commands(event.target.getAttribute("x-toast"), response);

		////////// x-modal
		window.Modal.unlock();
		Modal.handle_commands(event.target.getAttribute("x-modal"), response["type"]);

		////////// x-layers
		x.Layers.handle_commands(event.target.getAttribute("x-layer"), response["type"]);

		////////// response["actions"]
		window.x.Response.handle_actions(response);
	}

	// static #response(type, message, field, flash = false){
	static #response({
		form,
		type,
		message = null,
		field,
		border_flash = false,
		shake = false,
	}){
		// Check if form element passed
		if (!!form === false) return;

		const p_element = form.querySelector(`p[for=${field}]`);

		// Above submit button
		if (!!message != false && !!p_element === true) p_element.innerHTML = `<span class="text-color-${type}">${window.Lang.use(message)}</span>`;

		const field_element = form.querySelector(`[name=${field}]`);

		if (!!field_element === false) return;
		if (field_element.getAttribute("type") == "submit") return;

		field_element.focus();

		if (border_flash === true) x.VFX.border_flash(field_element, type, Form.#flash_duration);
		if (shake === true) x.VFX.shake(field_element);
	}

	static async #execute_on_response(func_name, response, form_data){
		if(!!func_name === false || typeof func_name != "string") return;
		await Form.#FUNC_POOL[func_name](response, form_data);
	}

	static #form_guard(form){
		// form Value Is Falsy
		if(!!form === false) return false;

		// Check If "form" has "for" Attribute
		if(form.hasAttribute("for") === false) return false;

		// Check If "form" Attribute "for" has Falsy Value
		if(!!form.getAttribute("for") === false) return false;

		return true;
	}

	static #response_guard(response){
		if(!("type" in response)) return false;

		return true;
	}
}

window.Form = Form;
