"use strict";

export default class Form{
	static #FUNC_POOL = {};
	static #flashDuration = 2000;

	/////////// APIs
	static collect(element = null){
		if(!!element === false) element = document;

		// Log.info(`Form.collect()`);

		// Returns Live Collection
		// const forms = element.getElementsByTagName("form");

		const forms = element.querySelectorAll('form');

		for(const form of forms){
			if(Form.#formGuard(form) === false) continue;

			Form.register(form);
		}
	}

	static register(form){
		Log.info(`Form.register()`);

		// Enable Events Listeners
		Form.#onInput(form);
		Form.#onSubmit(form);
	}

	static push_func(func){ Form.#FUNC_POOL[func.name] = func; }

	/////////// Helpers
	static #onInput(form){
	// check if onInput mode is enabled
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

	static #onSubmit(form){
		form.onsubmit = async (event)=>{
			event.preventDefault();

			// The Submitter
			const submitter = event.submitter;

			// Disable Submitter Button
			submitter.disabled = true;

			// After Submitting Form PLZW8
			Form.#response({
				form: form,
				type: "info",
				message: "plzW8",
				field: form.getAttribute("for")
			});

			// Get FormData
			let formData = new FormData(event.target);

			// Append for To FormData
			formData.append("for", form.getAttribute("for"));

			// Log FormData
			for(const [key, value] of formData.entries())
			console.log(`${key}: ${value}`);

			// Send The Request
			let response = await window.bridge(formData, form.action, form.enctype);

			// Data From Back-End
			Log.info(response);

			// On invalid response
			if(Form.#responseGuard(response) === false){
				Form.#response({
					form: form,
					type: "error",
					message: window.Lang.use("invalid_response"),
					field: form.getAttribute("for")
				});

				// Enable Submitter Button
				submitter.disabled = false;

				return;
			}

			// Flash Above Input Field
			if("field" in response)
				Form.#response({
					form: form,
					type: response["type"],
					message: null,
					field: response["field"],
					flash: true
				});

			// Text Above Submit Field
			Form.#response({
				form: form,
				type: response["type"],
				message: response["message"],
				field: form.getAttribute("for")
			});

			// Enable Submitter Button
			submitter.disabled = false;

			////////// x-modal
			Modal.handle_commands(form.getAttribute("x-modal"), response["type"]);

			////////// x-toast
			Toast.handle_commands(form.getAttribute("x-toast"), response);

			////////// Callback
			Form.#execute_on_response(form.getAttribute("func_name"), response);

			////////// response["actions"]
			if("actions" in response){
				// Update window.conf
				if("update_conf" in response["actions"]) window.conf = response["actions"]["update_conf"];

				// Set window.session["user"]
				if("set_session_user" in response["actions"]) window.dispatchEvent(new CustomEvent("user_session_change", {detail: response["actions"]["set_session_user"]}));

				// Delete window.session["user"]
				if("delete_session_user" in response["actions"]) window.dispatchEvent(new CustomEvent("user_session_change"));

				// Dom Update
				if("dom_change" in response["actions"]) window.dispatchEvent(new CustomEvent("dom_change", {detail: response["actions"]["dom_change"]}));

				// Redirect
				if("redirect" in response["actions"]) window.Hyperlink.locate(response["actions"]["redirect"]);

				// Reload
				if("reload" in response["actions"]) window.location.reload();
			}
		};
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
		const elementP = form.querySelector(`p[for=${field}]`);

		// Above Submit Button
		if(!!message != false && !!elementP === true) elementP.innerHTML = `<${type}>${window.Lang.use(message)}</${type}>`;

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
	setTimeout(()=>{element.removeAttribute("style");}, Form.#flashDuration);

	}

	static async #execute_on_response(func_name, response){
		if(!!func_name === false || typeof func_name != "string") return;
		await Form.#FUNC_POOL[func_name](response);
	}

	static #formGuard(form){
		// form Value Is Falsy
		if(!!form === false) return false;

		// Check If "form" has "for" Attribute
		if(form.hasAttribute("for") === false) return false;

		// Check If "form" Attribute "for" has Falsy Value
		if(!!form.getAttribute("for") === false) return false;

		return true;
	}

	static #responseGuard(response){
		if(!("type" in response)) return false;

		return true;
	}
}

// Make Form Usable W/O Importing It
window.Form = Form;
