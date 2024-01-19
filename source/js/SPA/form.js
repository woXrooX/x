"use strict";

export default class Form{
	static #flashDuration = 2000;

	static collect(element = null){
		if(!!element === false) element = document;

		Log.info(`Form.collect()`);

		// Returns Live Collection
		// const forms = element.getElementsByTagName("form");

		// Since We Are Manuallay Collecting Inside Modal We Want To Isolate Collecting "x-modal form" Here
		const forms = element.querySelectorAll(':not(x-modal) > form');

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

		let response = await window.bridge(`${form.getAttribute("for")}`, data);
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
			let response = await window.bridge(form.action, formData, form.enctype);

			// Data From Back-End
			Log.info(response);

			// On invalid response
			if(Form.#responseGuard(response) === false){
				Form.#response({
					form: form,
					type: "error",
					message: window.Lang.use("invalidResponse"),
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
			if(form.hasAttribute("x-modal")){
				// Hide
				if(response["type"] === "success" && form.getAttribute("x-modal") === "hide") window.Modal.hide();
			}

			////////// Toast
			if(form.hasAttribute("x-toast")) window.Toast.new(response["type"], response["message"]);

			////////// response["actions"]
			if("actions" in response){
				// Update window.conf
				if("updateConf" in response["actions"]) window.conf = response["actions"]["updateConf"];

				// Set window.session["user"]
				if("setSessionUser" in response["actions"]){
					window.session["user"] = response["actions"]["setSessionUser"];

					// Update Color Mode: User Dependent
					CSS.detectColorMode();
				}

				// Delete window.session["user"]
				if("deleteSessionUser" in response["actions"]){
					delete window.session["user"];

					// Update Color Mode: User Independent
					CSS.detectColorMode();
				}

				// Dom Update
				if("domChange" in response["actions"]) window.dispatchEvent(new CustomEvent("domChange", {detail: response["actions"]["domChange"]}));

				// Redirect
				if("redirect" in response["actions"]) window.Hyperlink.locate(response["actions"]["redirect"]);

				// Reload
				if("reload" in response["actions"]) window.location.reload();

				// Execute Function On Form Got Response
				if("onFormGotResponse" in response["actions"]) window.DOM.executeOnFormGotResponse(response);
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

	static #formGuard(form){
		// form Value Is Falsy
		if(!!form === false) return false;

		// Check If "form" has "action" Attribute
		if(form.hasAttribute("action") === false) return false;

		// Check If "form" Attribute "action" has Falsy Value
		if(!!form.action === false) return false;

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
