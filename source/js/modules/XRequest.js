// x-target-attr	"string_name"
// x-action 		innerHTML outerHTML replaceWith | if x-target-attr then sets key or value


"use strict";

export default class XRequest{
	static X_POST_ELEMENTS = null;

	static {
		XRequest.collect();
	}

	/////////// APIs
	static collect(){
		XRequest.X_POST_ELEMENTS = document.querySelectorAll("[x-post]");

		for(const element of XRequest.X_POST_ELEMENTS) XRequest.#applyEventListeners(element);
	}

	/////////// Helpers
	static #applyEventListeners(element){
		if(!element.hasAttribute("x-trigger") || element.getAttribute("x-trigger") === "click")
			element.onclick = async ()=>{
				element.disabled = true;

				const data = XRequest.#constructData(element);
				const response = await window.bridge(element.getAttribute("x-post"), data);
				window.Log.success(response)

				if("data" in response) XRequest.#handleXTarget(element, response["data"]);
				XRequest.#handleResponse(response);

				element.disabled = false;
			};
	}

	static #constructData(element){
		let data;

		try{data = JSON.parse(element.getAttribute("x-data"));}
		catch(error){data = null;}

		data = {
			...(element.hasAttribute("x-for") ? {"for": element.getAttribute("x-for")} : {}),
			...data
		}

		return data;
	}

	static #handleResponse(response){
		if(!("type" in response)) return;
		XRequest.#handleResponseActions(response);
	}

	static #handleResponseActions(response){
		if(!("actions" in response)) return;

		if("toast" in response["actions"] && response["actions"]["toast"] === true) window.Toast.new(response["type"], response["message"])

		if("domChange" in response["actions"]) window.dispatchEvent(new CustomEvent("domChange", {detail: response["actions"]["domChange"]}));

		if("redirect" in response["actions"]) window.Hyperlink.locate(response["actions"]["redirect"]);

		if("reload" in response["actions"]) window.location.reload();
	}


	static #handleXTarget(element, data){
		// If no x-target or has falsey value then action on self
		if(element.hasAttribute("x-target") === false || !!element.getAttribute("x-target") === false)
			return XRequest.#handleXAction(element, element.getAttribute("x-action"), data);

		const targetElement = document.querySelector(element.getAttribute("x-target"));
		// If no such element then action on self
		if(!!targetElement === false) return XRequest.#handleXAction(element, element.getAttribute("x-action"), data);

		XRequest.#handleXAction(targetElement, element.getAttribute("x-action"), data);
	}

	static #handleXAction(targetElement, action, data){
		if(!!action === false) targetElement.replaceWith(data);
		else if(action === "innerHTML") targetElement.innerHTML = data;
		else if(action === "outerHTML") targetElement.outerHTML = data;
		else if(action === "replaceWith") targetElement.replaceWith(data);
	}
};

