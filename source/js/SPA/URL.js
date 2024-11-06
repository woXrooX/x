export default class URL{
	static previous_location = {
		href: null,
		hash: null,
		pathname: null
	};

	static current_location = {
		href: null,
		hash: null,
		pathname: null
	};

	static {
		URL.#update_current_URL();

		URL.previous_location = structuredClone(URL.current_location);
	}

	static handle_change(){
		// Log.info("URL.handle_change()");

		URL.#update_current_URL();

		if(window.location.pathname != URL.previous_location.pathname){
			Router.handle();
			Menu.set_active();
		}

		if(window.location.href !== URL.previous_location.href) URL.previous_location = structuredClone(URL.current_location);
	}

	static handle_scroll_to_hash(){
		// Log.info("URL.handle_scroll_to_hash()");

		if(!!window.location.hash === false) return;

		const hashed_element = document.querySelector(window.location.hash);

		if(!!hashed_element === false) return;

		// Check if div#root > main has finished aniomation then scroll
		window.Main.element.ontransitionend = ()=>{
			window.Main.element.ontransitionend = null;
			hashed_element.scrollIntoView();
		};
	}

	static #update_current_URL(){
		// Log.info("URL.#update_current_URL()");

		URL.current_location.href = window.location.href;
		URL.current_location.hash = window.location.hash;
		URL.current_location.pathname = window.location.pathname;
	}
}


window.x["URL"] = URL;
