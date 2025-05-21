export default class DOM{
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
					window.x.Page.life_cycle();
					break;

				case "footer":
					Log.info(`DOM.update() - target: ${target}`);
					break;

				case "all":
					Log.info(`DOM.update() - target: ${target}`);
					Menu.build();
					window.x.Page.life_cycle();
					break;

				default:
					Log.warning(`DOM.update() - Unknown Target For Dom Change: ${target}`);
			}
	}
}

window.DOM = DOM;
