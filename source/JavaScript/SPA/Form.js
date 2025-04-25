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

				let response = await window.bridge(data, `${form.getAttribute("for")}`);
				if("field" in response) Form.#response(response["field"], response["type"], response["message"]);
			};
		});
	}

	static async #on_submit(event){
		event.preventDefault();

		// The Submitter
		const submitter = event.submitter;

		// Disable Submitter Button
		submitter.disabled = true;

		window.Modal.lock();

		// After Submitting Form PLZW8
		Form.#response({
			form: event.target,
			type: "info",
			message: "plzW8",
			field: event.target.getAttribute("for")
		});

		// Get FormData
		let form_data = new FormData(event.target);

		// Append for To FormData
		form_data.append("for", event.target.getAttribute("for"));

		// DEV: Log FormData
		// for(const [key, value] of form_data.entries()) console.log(`${key}: ${value}`);

		// Send The Request
		let response = await window.bridge(form_data, event.target.action, event.target.enctype);

		// DEV: Data From Back-End
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

		// Flash Above Input Field
		if("field" in response)
			Form.#response({
				form: event.target,
				type: response["type"],
				message: null,
				field: response["field"],
				flash: true
			});

		// Text Above Submit Field
		Form.#response({
			form: event.target,
			type: response["type"],
			message: response["message"],
			field: event.target.getAttribute("for")
		});

		// Enable Submitter Button
		submitter.disabled = false;

		////////// x-modal
		window.Modal.unlock();
		Modal.handle_commands(event.target.getAttribute("x-modal"), response["type"]);

		////////// x-layer
		const container_element = event.target.closest('container[id^="layer_"]');
		let form_element = container_element.querySelector(`layer > main > form`);
		window.x["Layers"].handle_commands(form_element.getAttribute("x-layer"), response["type"]);

		////////// x-toast
		Toast.handle_commands(event.target.getAttribute("x-toast"), response);

		////////// Callback
		Form.#execute_on_response(event.target.getAttribute("form_func"), response);

		////////// response["actions"]
		if("actions" in response){
			if("update_conf" in response["actions"]) window.conf = response["actions"]["update_conf"];

			if("set_session_user" in response["actions"]) window.dispatchEvent(new CustomEvent("user_session_change", {detail: response["actions"]["set_session_user"]}));

			if("delete_session_user" in response["actions"]) window.dispatchEvent(new CustomEvent("user_session_change"));

			if("redirect" in response["actions"]) window.Hyperlink.locate(response["actions"]["redirect"]);

			if("reload" in response["actions"]) window.location.reload();

			if("DOM_change" in response["actions"]) window.dispatchEvent(new CustomEvent("DOM_change", {detail: response["actions"]["DOM_change"]}));
		}
	}

	// static #response(type, message, field, flash = false){
	static #response({
		form = null,
		type,
		message,
		field,
		flash = false,
	}){
		// Check If Form Element Passed
		if(!!form === false) return;

		// Element <p>
		const element_p = form.querySelector(`p[for=${field}]`);

		// Above Submit Button
		if(!!message != false && !!element_p === true) element_p.innerHTML = `<${type}>${window.Lang.use(message)}</${type}>`;

		// Focus & Flash The Border Color
		const element = form.querySelector(`[name=${field}]`);

		if(!!element === true && element.getAttribute("type") != "submit"){
			// Focus
			element.focus();

			// Flash Border Color
			if(flash === true) Form.#flash(type, element);
		}
	}

	static #flash(type, element){
		// Activate Border Color
		element.style.borderColor = getComputedStyle(document.body).getPropertyValue(`--color-${type}`);

		// Flash Border Color
		setTimeout(()=>{element.removeAttribute("style");}, Form.#flash_duration);
	}

	static async #execute_on_response(func_name, response){
		if(!!func_name === false || typeof func_name != "string") return;
		await Form.#FUNC_POOL[func_name](response);
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
