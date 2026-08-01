export default class Header{
	static selector = "body > header";
	static #element = null;
	static #mounted_source = null;

	static init() {
		Header.#element = document.querySelector(Header.selector);
	}

	static async handle() {
		//// Page level header — always re-renders, since each page's header differs
		if (typeof window.x.Page.current_page.header === "function") {
			Header.#mounted_source = "page";

			return Header.#build(await window.x.Page.current_page.header());
		}

		//// Project level header — shared, so skip if it's already mounted
		if (Header.#mounted_source === "project") return;

		Header.#mounted_source = "project";

		try {
			const project_header = await import(`/JavaScript/modules/header.js`);

			if (typeof project_header.default === "function") return Header.#build(await project_header.default());
			else return Header.#hide();
		}

		catch (error) {
			Header.#hide();
			return;
		}
	}

	static #hide() {
		if (!!Header.#element === false) return;

		Header.#element.classList.add("display-none");
	}

	static #show() {
		if (!!Header.#element === false) return;

		Header.#element.classList.remove("display-none");
	}

	static #build(content) {
		Log.info("Header.#build()");

		if (content === false) return Header.#hide();

		Header.#element.innerHTML = content;
		Header.#show();
	}
}

window.Header = Header;
