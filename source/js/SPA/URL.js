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
		URL.current_location.href = window.location.href;
		URL.current_location.hash = window.location.hash;
		URL.current_location.pathname = window.location.pathname;

		URL.previous_location = structuredClone(URL.current_location);
	}

	static handle_change(){
		Log.error("URL.handle_change()");

		URL.current_location.href = window.location.href;
		URL.current_location.hash = window.location.hash;
		URL.current_location.pathname = window.location.pathname;

		console.log("Prev", URL.previous_location);
		console.log("Curr", URL.current_location);


		// if(
		// 	window.location.pathname === URL.previous_location.pathname &&
		// 	window.location.hash != URL.previous_location.hash
		// ) return;

		if(window.location.pathname != URL.previous_location.pathname){
			Router.handle();
			Menu.set_active();
		}

		if(window.location.href !== URL.previous_location.href) URL.previous_location = structuredClone(URL.current_location);
	}
}


window.x["URL"] = URL;
