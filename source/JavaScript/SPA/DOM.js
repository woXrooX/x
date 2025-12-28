export default class DOM{
	static update(targets = []){
		Log.info("DOM.update() - init");

		for(const target of targets)
			switch(target){
				case "menu":
					Log.info(`DOM.update() - target: ${target}`);
					window.x.Menu.build();
					break;

				case "header":
					Log.info(`DOM.update() - target: ${target}`);
					break;

				case "main":
					Log.info(`DOM.update() - target: ${target}`);
					window.x.Page.life_cycle();
					break;

				case "footer":
					Log.info(`DOM.update() - target: ${target}`);
					break;

				case "all":
					Log.info(`DOM.update() - target: ${target}`);
					window.x.Menu.build();
					window.x.Page.life_cycle();
					break;

				default:
					Log.warning(`DOM.update() - Unknown Target For Dom Change: ${target}`);
			}
	}


	/*
		"beforebegin" → before the element itself (as a sibling)
		"afterbegin" → inside, at the top
		"beforeend" → inside, at the bottom
		"afterend" → after the element itself (as a sibling)
	*/
	static async build(
		parent_selector,
		callback,
		options = {
			"method": "innerHTML",
			// "method": "insertAdjacentHTML",

			"position": '='
			// "position": "+="
			// "position": "afterbegin"
			// "position": "beforeend"
		},
		...args
	) {
		const parent_element = document.querySelector(parent_selector);
		if (!parent_element) return Log.error(`DOM.build(): Parent element does not exist: ${parent_selector}`);

		Loading.on_element_start(parent_element);

		try {
			// Yield until the next paint, so the browser can render the "loading" state
			// Before we start the heavy DOM work (double RAF is more reliable than single).
			await new Promise(RAF => requestAnimationFrame(RAF));
			await new Promise(RAF => requestAnimationFrame(RAF));

			const HTML = await callback(parent_element, ...args);

			if (options["method"] == "innerHTML") {
				if (options["position"] == '=') parent_element.innerHTML = HTML;
				if (options["position"] == "+=") parent_element.innerHTML += HTML;
			}

			else if (options["method"] == "insertAdjacentHTML") parent_element.insertAdjacentHTML(options["position"], HTML);
		}

		catch (error) {
			parent_element.innerHTML = `<p class="surface-error width-100 padding-2">${error}</p>`;
			Log.error(`DOM.build(): ERROR`);
			console.log(error);
		}

		finally {
			Loading.on_element_end(parent_element);
		}
	}
}

window.DOM = DOM;
