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

	static async build(parent_selector, callback, ...args) {
		const parent_element = document.querySelector(parent_selector);
		if (!parent_element) return Log.error(`DOM.build(): Parent element does not exist: ${parent_selector}`);

		Loading.on_element_start(parent_element);

		try {
			parent_element.innerHTML = await callback(...args);
		}

		catch (error) {
			Log.error(`DOM.build(): ${error}`);
		}

		finally {
			Loading.on_element_end(parent_element);
		}
	}
}

window.DOM = DOM;
