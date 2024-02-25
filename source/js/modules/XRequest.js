// 0.1.0001

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
	#commands;
	#action = null;
	#source = "";
	#target;
	#response;

	#instructions = [
		// {
		// 	"types": [],
		// 	"action": [],
		// 	"source": ""
		// }
	];

	constructor(element){
		this.#element = element;
		this.#trigger = this.#element.getAttribute("x-trigger") ?? "click";
		this.#commands = this.#element.getAttribute("x-commands");
		this.#target = this.#element.getAttribute("x-target") ? document.querySelector(this.#element.getAttribute("x-target")) : null;

		this.#constructData();
		this.#handleTrigger();
		this.#parseCommands();
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

	#parseCommands(){
		if(!!this.#commands === false) return;
		if(!!this.#target === false) return;

		const commands = this.#commands.split(' ');

		for(const command of commands){
			const parts = command.split(':');

			// Invalid command
			if(parts.length !== 4) continue;

			this.#instructions.push({
				"types": parts[1].split('|'),
				"action": parts[2],
				"source": parts[3]
			});
		}
	}

	#handleCommands(){
		if(!("type" in this.#response)) return;

		for(const instruction of this.#instructions){
			if(instruction["types"].includes("any") || instruction["types"].includes(this.#response["type"])){
				if(instruction["source"] === "data") this.#source = this.#response["data"] ?? null;
				else if(instruction["source"] === "message") this.#source = window.Lang.use(this.#response["message"]);

				this.#action = instruction["action"];

				this.#handleActions();

				break;
			}
		}
	}

	#handleActions(){
		if(!!this.#source === false) return;

		if(this.#action === "innerHTML") this.#target.innerHTML = this.#source;
		else if(this.#action === "outerHTML") this.#target.outerHTML = this.#source;
		else if(this.#action === "replaceWith") this.#target.replaceWith(this.#source);
		else if(this.#action.startsWith("setAttribute")) this.#handleSetAttribute();
	}

	#handleSetAttribute(){
		let arr = this.#action
					.slice(
						this.#action.indexOf("[")+1,
						this.#action.indexOf("]")
					)
					.split(',');

		if(arr.length > 0) this.#target.setAttribute(arr[0], this.#source ?? arr[1] ?? '');
	}

	/////////// Event listeners
	#onClick(){
		this.#element.onclick = async ()=>{
			this.#element.disabled = true;

			this.#response = await window.bridge(this.#element.getAttribute("x-post"), this.#data);

			this.#handleCommands();

			if(this.#element.hasAttribute("x-toast")) window.Toast.new(this.#response["type"], this.#response["message"]);

			XRequest.#handleResponseActions(this.#response);

			this.#element.disabled = false;
		};
	}
};
