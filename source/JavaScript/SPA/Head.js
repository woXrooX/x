export default class Head{
	/////////////////////////// Static

	static #title = '';
	static #description = '';

	static {
		Head.#save_defaults();
	}

	/////////// APIs

	static set_title(title){
		let final_title = '';

		if(!!title === false) final_title = window.Lang.use(window.CONF["project_name"]);
		else final_title = `${window.Lang.use(title)} | ${window.Lang.use(window.CONF["project_name"])}`;

		document.title = final_title;
		document.querySelector('meta[property="og:title"]')?.setAttribute("content", final_title);
		document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", final_title);
	}

	static reset_title(){
		Head.set_title(Head.#title);
	}

	static set_description(description){
		if (!!description === false) return;

		document.querySelector('meta[name="description"]')?.setAttribute('content', description);
		document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
		document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
	}

	static reset_description(){
		Head.set_description(Head.#description);
	}

	/////////// Helpers

	static #save_defaults(){
		Head.#title = document.querySelector('title')?.textContent || '';
		Head.#description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
	}
}

window.x["Head"] = Head;
