// x-action 		innerHTML outerHTML replaceWith setAttribute:[name,value]

"use strict";

export default class XRequest{
	/////////////////////////// Static

	static XR_ELEMENTS = null;
	static #OBJECTS = [];

	/////////// APIs
	// Collecting happens whenever Core.#observeMutations() -> observes any DOM change
	// NOTE: If page has zero change on initial load, the XRequest.collect() will not be called and the first XRequest attached elements will not be listened
	static collect(){
		Log.info("XRequest.collect()");

		XRequest.#OBJECTS = [];

		XRequest.XR_ELEMENTS = document.querySelectorAll("[x-post]");

		for(const element of XRequest.XR_ELEMENTS) XRequest.#OBJECTS.push(new XRequest(element));
	}

	/////////// Helpers
	static #handleResponseActions(response){
		if(!("actions" in response)) return;

		if("domChange" in response["actions"]) window.dispatchEvent(new CustomEvent("domChange", {detail: response["actions"]["domChange"]}));

		if("redirect" in response["actions"]) window.Hyperlink.locate(response["actions"]["redirect"]);

		if("reload" in response["actions"]) window.location.reload();
	}


	/////////////////////////// Object

	#element;
	#for;
	#data;
	#trigger;
	#action;
	#target;
	#response;

	constructor(element){
		this.#element = element;
		this.#trigger = this.#element.getAttribute("x-trigger") ?? "click";
		this.#action = this.#element.getAttribute("x-action") ?? "replaceWith";
		this.#target = document.querySelector(this.#element.getAttribute("x-target")) ?? this.#element;

		this.#constructData();
		this.#handleTrigger();
	}

	#constructData(){
		try{this.#data = JSON.parse(this.#element.getAttribute("x-data"));}
		catch(error){this.#data = null;}

		this.#data = {
			...(this.#element.hasAttribute("x-for") ? {"for": this.#element.getAttribute("x-for")} : {}),
			...this.#data
		}
	}

	/////////// Handlers
	#handleTrigger(){
		switch(this.#trigger){
			case "click":
				this.#onClick();
				break;

			default:
				this.#onClick();
				break;
		}
	}

	#handleAction(){
		if(this.#action === "innerHTML") this.#target.innerHTML = this.#response.data;
		else if(this.#action === "outerHTML") this.#target.outerHTML = this.#response.data;
		else if(this.#action === "replaceWith") this.#target.replaceWith(this.#response.data);
		else if(this.#action.startsWith("setAttribute")) this.#handleSetAttribute();
		else this.#target.replaceWith(this.#response.data);
	}

	#handleSetAttribute(){
		let arr = this.#action
					.slice(
						this.#action.indexOf("[")+1,
						this.#action.indexOf("]")
					)
					.split(',');


		if(arr.length > 0) this.#target.setAttribute(arr[0], this.#response.data ?? arr[1] ?? '');
	}

	/////////// Event listeners
	#onClick(){
		this.#element.onclick = async ()=>{
			this.#element.disabled = true;

			this.#response = await window.bridge(this.#element.getAttribute("x-post"), this.#data);
			window.Log.success(this.#response);

			this.#handleAction();

			if(this.#element.hasAttribute("x-toast")) window.Toast.new(this.#response["type"], this.#response["message"]);

			XRequest.#handleResponseActions(this.#response);

			this.#element.disabled = false;
		};
	}
};
