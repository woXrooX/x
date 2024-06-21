// const newDiv = document.createElement("div");
// const newContent = document.createTextNode("Hi there and greetings!");
// newDiv.appendChild(newContent);


// else if(DOM.page.before.constructor.name === 'Function') DOM.page.before();

export default class DOM{
	static #page = null;

	static async set_page(page){
		// Check If Page Is Valid
		if(!!page == false) return;

		// Update "page" Variable
		DOM.#page = page;

		// Start The Page's Life Cycle
		await DOM.life_cycle();
	}

	static async life_cycle(){
		Log.info("DOM.life_cycle()");

		// Title
		window.Title.set(DOM.#page.TITLE);

		// Before
		if(!!DOM.#page.before === true) await DOM.#page.before();

		// Header
		await window.Header.handle(DOM.#page.header);

		// Default/Main - Render the main function
		if(typeof DOM.#page.default === "function") await DOM.render(await DOM.#page.default());
		else await DOM.render(Main.situationalContent("error", "ERROR", "DOM.life_cycle() -> No default function defined!"));

		// Footer
		await window.Footer.handle(DOM.#page.footer);

		// After
		if(!!DOM.#page.after === true) await DOM.#page.after();

		// Scroll to top after DOM is ready
		document.querySelector("body > main").scrollTo({top: 0,left: 0})
	}

	static async render(dom){
		// If passed object like: createElement("x-form")
		if(typeof dom === "object") window.Main.element.replaceChildren(dom);

		// If passed string like: "<x-form></x-from>"
		else if(typeof dom === "string") window.Main.element.innerHTML = dom;

		window.dispatchEvent(new CustomEvent("domChange"));
	}

	static update(targets = []){
		Log.info("DOM.update() - init");

		for(const target of targets)
			switch(target){
				case "menu":
					Log.info(`DOM.update() - target: ${target}`);
					Menu.build();
					break;

				case "header":
					Log.info(`DOM.update() - target: ${target}`);
					break;

				case "main":
					Log.info(`DOM.update() - target: ${target}`);
					DOM.life_cycle();
					break;

				case "footer":
					Log.info(`DOM.update() - target: ${target}`);
					break;

				case "all":
					Log.info(`DOM.update() - target: ${target}`);
					Menu.build();
					DOM.life_cycle();
					break;

				default:
					Log.warning(`DOM.update() - Unknown Target For Dom Change: ${target}`);
			}
	}
}

// Make DOM usable W/O importing it
window.DOM = DOM;
