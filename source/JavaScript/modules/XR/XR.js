// XR = XRequest

import Post from "./request_methods/Post.js";
import Editable from "./request_methods/Editable.js";

export default class XR {
	/////////////////////////// Static
	static #FUNC_POOL = {};

	/////////// APIs
	// Collecting happens whenever Core.#observeMutations() -> observes any DOM change
	// NOTE: If page has zero change on initial load, the XR.collect() will not be called and the first XR attached elements will not be listened

	static collect(){
		// Log.info("XR.collect()");

		Post_elements: {
			const post_elements = document.querySelectorAll("[XR-post]");
			for (const element of post_elements) new Post(element);
		}

		Editable_elements: {
			const editable_elements = document.querySelectorAll("[XR-editable]");
			for (const element of editable_elements) new Editable(element);
		}
	}

	static push_func(func) { XR.#FUNC_POOL[func.name] = func; }

	static async execute_on_response(func_name, response, element){
		if(!!func_name === false) return;
		await XR.#FUNC_POOL[func_name](response, element);
	}
}

window.x["XR"] = XR;
