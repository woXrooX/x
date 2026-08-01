export default class Footer{
	static selector = "body > div#root > footer";
	static #element = null;
	static #mounted_source = null;

	static init() {
		Footer.#element = document.querySelector(Footer.selector);
	}

	static async handle() {
		//// Page level footer — always re-renders, since each page's footer differs
		if (typeof window.x.Page.current_page.footer === "function") {
			Footer.#mounted_source = "page";

			return Footer.#build(await window.x.Page.current_page.footer());
		}

		//// Project level footer — shared, so skip if it's already mounted
		if (Footer.#mounted_source === "project") return;

		Footer.#mounted_source = "project";

		try {
			const project_footer = await import(`/JavaScript/modules/footer.js`);

			if (typeof project_footer.default === "function") return Footer.#build(await project_footer.default());
			else return Footer.#hide();
		}

		catch (error) {
			Footer.#hide();
			return;
		}
	}

	static #hide() {
		if (!!Footer.#element === false) return;

		Footer.#element.classList.add("display-none-important");
	}

	static #show() {
		if (!!Footer.#element === false) return;

		Footer.#element.classList.remove("display-none-important");
	}

	static #build(content) {
		Log.info("Footer.#build()");

		if (content === false) return Footer.#hide();

		Footer.#element.innerHTML = content;
		Footer.#show();
	}
}

window.Footer = Footer;
