export default class Header{
	static selector = "body > header";
	static #element = null;

	static init(){
		Header.#element = document.querySelector(Header.selector);
	}

	static async handle(){
		//// Page level header
		if (typeof window.x.Page.current_page.header === "function") return Header.#build(window.x.Page.current_page.header());

		//// Project level header
		// Project level header will be always created by x during initialization the x
		try {
			const project_header = await import(`/JavaScript/modules/header.js`);

			if (typeof project_header.default === "function") return Header.#build(project_header.default());
			else return Header.#hide();
		}

		catch (error) {
			Header.#hide();
			return;
		}
	}

	static #hide(){
		// Check If "body > header" Exists
		if(!!Header.#element === false) return;

		Header.#element.classList.add("display-none");
	}

	static #show(){
		// Check If "body > header" Exists
		if(!!Header.#element === false) return;

		Header.#element.classList.remove("display-none");
	}

	static #build(content){
		Log.info("Header.#build()");

		if (content === false) return Header.#hide();

		Header.#element.innerHTML = content;
		Header.#show();
	}
}

window.Header = Header;
