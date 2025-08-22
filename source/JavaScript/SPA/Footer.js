export default class Footer{
	static selector = "body > div#root > footer";
	static #element = null;

	static init(){
		Footer.#element = document.querySelector(Footer.selector);
	}

	static async handle(){
		//// Page level footer
		if (typeof window.x.Page.current_page.footer === "function") return Footer.#build(window.x.Page.current_page.footer());

		//// Project level footer
		// Project level footer will be always created by x during initialization the x
		try {
			const project_footer = await import(`/JavaScript/modules/footer.js`);

			if (typeof project_footer.default === "function") return Footer.#build(project_footer.default());
			else return Footer.#hide();
		}

		catch (error) {
			Footer.#hide();
			return;
		}
	}

	static #hide(){
		// Check If "body > footer" Exists
		if(!!Footer.#element === false) return;

		Footer.#element.classList.add("display-none");
	}

	static #show(){
		// Check If "body > footer" Exists
		if(!!Footer.#element === false) return;

		Footer.#element.classList.remove("display-none");
	}

	static #build(content){
		Log.info("Footer.#build()");

		if (content === false) return Footer.#hide();

		Footer.#element.innerHTML = content;
		Footer.#show();
	}
}

window.Footer = Footer;
