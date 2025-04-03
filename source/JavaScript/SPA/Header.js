export default class Header{
	static selector = "body > header";
	static #element = null;
	static #content_func = null;

	static init(){
		Header.#element = document.querySelector(Header.selector);
	}

	static async handle(func){
		// Check if page scoped header() defined
		if(typeof func === "function"){
			// If header() doesn return false then execute tt
			const func_return_value = await func();
			if(func_return_value !== false) await Header.#build(func_return_value);

			// Else hide header on this page
			else Header.#hide();
		}

		// If no talk to default header.js
		else{
			try {
				Header.#content_func = await import(`/JavaScript/modules/header.js`);
			}

			catch(error){
				Header.#hide();
				return;
			}

			// Check if
			if(
				// header.js has default method to call
				typeof Header.#content_func.default === "function" &&

				// And does not return false
				Header.#content_func.default() !== false
			) await Header.#build();

			// Else hide header
			else Header.#hide();
		}
	}

	static #hide(){
		// Check If "body > header" Exists
		if(!!Header.#element === false) return;

		Header.#element.classList.add("hide");
	}

	static #show(){
		// Check If "body > header" Exists
		if(!!Header.#element === false) return;

		Header.#element.classList.remove("hide");
	}

	// When called W/O argument will update to default header view
	static async #build(content = null){
		Log.info("Header.#build()");

		// Check if "body > header" exists
		if(!!Header.#element === false) return;

		// If no content passed update to default
		if(!!content === false){
			Header.#element.innerHTML = await Header.#content_func.default();
			Header.#show();

			// Exit the update
			return;
		}

		// If content passed update to content
		Header.#element.innerHTML = content;
		Header.#show();
	}
}

window.Header = Header;
