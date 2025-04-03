export default class Footer{
	static selector = "body > div#root > footer";
	static #element = null;
	static #content_func = null;

	static init(){
		Footer.#element = document.querySelector(Footer.selector);
	}

	static async handle(func){
		// Check If Page Scoped footer() Defined
		if(typeof func === "function"){
			// If footer() Doesn Return False Then Execute It
			if(func() !== false) Footer.#build(func());

			// Else Hide Footer On This Page
			else Footer.#hide();
		}

		// If No Talk To Default footer.js
		else{
			try{
				Footer.#content_func = await import(`/JavaScript/modules/footer.js`);
			}catch(error){
				Footer.#hide();
				return;
			}

			// Check If
			if(
				// footer.js Has Default Method To Call
				typeof Footer.#content_func.default === "function" &&
				// And Doesn Return False
				Footer.#content_func.default() !== false
			) Footer.#build();

			// Else Hide Footer
			else Footer.#hide();
		}
	}

	static #hide(){
		// Check If "body > footer" Exists
		if(!!Footer.#element === false) return;

		Footer.#element.classList.add("hide");
	}

	static #show(){
		// Check If "body > footer" Exists
		if(!!Footer.#element === false) return;

		Footer.#element.classList.remove("hide");
	}

	// When Called W/O Argument Will Update To Default Footer View
	static #build(content = null){
		Log.info("Footer.#build()");

		// Check If "body > footer" Exists
		if(!!Footer.#element === false) return;

		// If No Content Passed Update To Default
		if(!!content === false){
			Footer.#element.innerHTML = Footer.#content_func.default();
			Footer.#show();

			// Exit The Update
			return;
		}

		// If Content Passed Update To Content
		Footer.#element.innerHTML = content;
		Footer.#show();
	}
}

// Make Footer Usable W/O Importing It
window.Footer = Footer;
