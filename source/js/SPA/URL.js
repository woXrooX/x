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

	static #update_current_URL(){
		// Log.info("URL.#update_current_URL()");

		URL.current_location.href = window.location.href;
		URL.current_location.hash = window.location.hash;
		URL.current_location.pathname = window.location.pathname;
	}
}


window.x["URL"] = URL;
