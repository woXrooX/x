// const newDiv = document.createElement("div");
// const newContent = document.createTextNode("Hi there and greetings!");
// newDiv.appendChild(newContent);


// else if(DOM.page.before.constructor.name === 'Function') DOM.page.before();

export default class DOM{
	static #page = null;

	static set_page(page){
		// Check If Page Is Valid
		if(!!page == false) return;

		// Update "page" Variable
		DOM.#page = page;

		// Start The Page's Life Cycle
		DOM.life_cycle();
	}

	static async life_cycle(){
		Log.info("DOM.life_cycle()");

		// Create page scoped variable
		window.page_data = {};

		////////// Title
		window.Title.set(DOM.#page.TITLE);

		////////// Before
		if(!!DOM.#page.before === true)
			if(DOM.#page.before.constructor.name === 'AsyncFunction') await DOM.#page.before();
			else DOM.#page.before();

		////////// Header
		window.Header.handle(DOM.#page.header);

		////////// Default/Main - Render the main function
		if(typeof DOM.#page.default === "function")
			if(DOM.#page.default.constructor.name === 'AsyncFunction') DOM.render(await DOM.#page.default());
			else DOM.render(DOM.#page.default());
		else DOM.render(Main.situationalContent("error", "ERROR", "DOM.life_cycle() -> No default function defined!"));

		////////// Footer
		window.Footer.handle(DOM.#page.footer);

		////////// After
		if(!!DOM.#page.after === true)
			if(DOM.#page.after.constructor.name === 'AsyncFunction') await DOM.#page.after();
			else DOM.#page.after();

		// Delete the page data at the end of each life_cycle()
		delete window.page_data;
	}

	static render(dom){
		// Scroll to top before rendering
		window.scrollTo(0, 0);

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
