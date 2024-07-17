export default class XRequest{
	/////////////////////////// Static

	static XR_ELEMENTS = null;
	static #OBJECTS = [];
	static #FUNC_POOL = {};

	/////////// APIs
	// Collecting happens whenever Core.#observeMutations() -> observes any DOM change
	// NOTE: If page has zero change on initial load, the XRequest.collect() will not be called and the first XRequest attached elements will not be listened
	static collect(){
		// Log.info("XRequest.collect()");

		XRequest.#OBJECTS = [];

		XRequest.XR_ELEMENTS = document.querySelectorAll("[xr-post]");

		for(const element of XRequest.XR_ELEMENTS) XRequest.#OBJECTS.push(new XRequest(element));
	}

	/////////// APIs
	static push_func(func) { XRequest.#FUNC_POOL[func.name] = func; }

	/////////// Helpers
	static #handle_response_actions(response){
		if(!("actions" in response)) return;

		if("updateConf" in response["actions"]) window.conf = response["actions"]["updateConf"];

		if("setSessionUser" in response["actions"]) window.dispatchEvent(new CustomEvent("user_session_change", {detail: response["actions"]["setSessionUser"]}));

		if("deleteSessionUser" in response["actions"]) window.dispatchEvent(new CustomEvent("user_session_change"));

		if("domChange" in response["actions"]) window.dispatchEvent(new CustomEvent("domChange", {detail: response["actions"]["domChange"]}));

		if("redirect" in response["actions"]) window.Hyperlink.locate(response["actions"]["redirect"]);

		if("reload" in response["actions"]) window.location.reload();
	}

	static async #execute_on_response(func_name, response, element){
		if(!!func_name === false) return;
		await XRequest.#FUNC_POOL[func_name](response, element);
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
		this.#trigger = this.#element.getAttribute("xr-trigger") ?? "click";
		this.#commands = this.#element.getAttribute("xr-commands");
		this.#target = this.#element.getAttribute("xr-target") ? document.querySelector(this.#element.getAttribute("xr-target")) : null;

		this.#construct_data();
		this.#handle_trigger();
		this.#parse_commands();
	}

	#construct_data(){
		try{this.#data = JSON.parse(this.#element.getAttribute("xr-data"));}
		catch(error){this.#data = null;}

		this.#data = {
			...(this.#element.hasAttribute("xr-for") ? {"for": this.#element.getAttribute("xr-for")} : {}),
			...this.#data
		}
	}

	/////////// Handlers
	#handle_trigger(){
		switch(this.#trigger){
			case "click":
				this.#on_click();
				break;

			default:
				this.#on_click();
				break;
		}
	}

	#parse_commands(){
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

	#handle_commands(){
		if(!("type" in this.#response)) return;

		for(const instruction of this.#instructions){
			if(instruction["types"].includes("any") || instruction["types"].includes(this.#response["type"])){
				if(instruction["source"] === "data") this.#source = this.#response["data"] ?? '';
				else if(instruction["source"] === "message") this.#source = window.Lang.use(this.#response["message"]);

				this.#action = instruction["action"];

				this.#handle_actions();

				break;
			}
		}
	}

	#handle_actions(){
		if(!!this.#source === false) return;

		if(this.#action === "innerHTML") this.#target.innerHTML = this.#source;
		else if(this.#action === "outerHTML") this.#target.outerHTML = this.#source;
		else if(this.#action === "replaceWith") this.#target.replaceWith(this.#source);
		else if(this.#action.startsWith("setAttribute")) this.#handle_set_attribute();
	}

	#handle_set_attribute(){
		let arr = this.#action
					.slice(
						this.#action.indexOf("[")+1,
						this.#action.indexOf("]")
					)
					.split(',');

		if(arr.length > 0) this.#target.setAttribute(arr[0], this.#source ?? arr[1] ?? '');
	}

	/////////// Event listeners
	#on_click(){
		this.#element.style.cursor = "pointer";

		this.#element.onclick = async ()=>{
			Loading.on_element(this.#element);

			this.#response = await window.bridge(this.#data, this.#element.getAttribute("xr-post"));

			if(!("type" in this.#response)) return;

			XRequest.#execute_on_response(this.#element.getAttribute("xr-func"), this.#response, this.#element);

			this.#handle_commands();

			Toast.handle_commands(this.#element.getAttribute("x-toast"), this.#response);

			Modal.handle_commands(this.#element.getAttribute("x-modal"), this.#response["type"]);

			XRequest.#handle_response_actions(this.#response);

			Loading.on_element(this.#element);
		};
	}
};

// Make XRequest Usable W/O Importing It
window.XRequest = XRequest;
