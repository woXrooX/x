export default class Router{
	static current_page = {
		"name": null,
		"endpoint": null,
		"full_URL": null,
		"url_args": {}
	}

	static async handle(){
		// Check if app is down if so stop handling and set app_is_down as a current page
		if("app_is_down" in window.CONF["tools"]){
			Router.current_page.name = "app_is_down";
			Router.#load_page_file();
			return;
		}

		// Check the "window.location.pathname" for the error URLs
		if(Router.error_handlers() === true){
			Router.#load_page_file();
			return;
		}

		// NOTE: We have much efficient way of detecting "if page exists" if we give up on endpoints system
		loop_pages: for(const page in window.CONF["pages"]){
			if(Router.guard(page) === false) continue;

			// Window Path Name
			let pathname = window.location.pathname;

			if("url_args" in window.CONF.pages[page]){
				//// NOTE: Order matters in this scope

				// Create array of URL arguments from the "pathname"
				const args = pathname.split('/').splice(-window.CONF.pages[page].url_args.length);

				// Assign key value pairs of URL arguments inside "Router.current_page.url_args"
				for(let index = 0; index < args.length; index++) Router.current_page.url_args[window.CONF.pages[page].url_args[index]] = args[index];

				// Extract URL arguments from the "pathname"
				pathname = pathname.split('/').slice(0, -window.CONF.pages[page].url_args.length).join('/');
			}

			loop_endpoints: for(const endpoint of window.CONF["pages"][page]["endpoints"])
				// Check if page endpoint equals to currnt endpoint
				if(endpoint == pathname){
					//// Check if page is not the current loaded page
					// TODO: We need to create a endpoints matching loop like in thr  Menu.set_active() in order to fix issues like "/" and "/home" are being rendered even the page is thesame
					// NOTE: endpoint should be unique.
					// Page a and page b can not have the same endpoint. It may seem working but there will be bugs. It will make return false the expression below in rare cases.
					// If yes then exit this method
					if(Router.current_page.full_URL === window.location.href) return;

					Router.current_page.name = page;
					Router.current_page.endpoint = endpoint;
					Router.current_page.full_URL = window.location.href;

					break loop_pages;
				}
		}

		// If still no endpoint matched then set it to "404"
		if(Router.current_page.name === null) Router.current_page.name = "404";

		// Load page file
		Router.#load_page_file();
	}

	static async #load_page_file(){
		window.Log.info(`Page file is loading: ${Router.current_page.name}.js`);

		try{
			if(DOM.page !== null && !!DOM.page.on_page_unmount === true) await window.DOM.page.on_page_unmount();

			// Start loading effects
			window.Loading.start();
			window.Main.animation_start();

			// Load page file
			await window.DOM.set_page(await import(`/JavaScript/pages/${Router.current_page.name}.js`));
		}

		catch(error){
			// Log.line();
			// Log.error(error);
			// Log.error(error.name);
			// Log.error(error.message);
			// Log.error(error.stack);
			// Log.line();

			window.Header.handle();

			if("CONF" in window && window.CONF.tools.debug === true){
				window.DOM.render(Main.situational_content("error", error.name, error.stack));
				console.trace(error);
			}

			else window.DOM.render(Main.situational_content("warning", Lang.use("warning"), Lang.use("something_went_wrong")));

			window.Footer.handle();
		}

		finally{
			// End loading effects
			window.Loading.end();
			window.Main.animation_end();
			window.x.URL.handle_scroll_to_hash();
		}
	}

	static error_handlers(){
		switch(window.location.pathname){
			case "/400":
				Router.current_page.name = "400";
				return true;

			case "/403":
				Router.current_page.name = "403";
				return true;

			case "/404":
				Router.current_page.name = "404";
				return true;

			default: return false;
		}
	}

	static guard(page){
		const PAGE_CONF = window.CONF["pages"][page]

		if(PAGE_CONF["enabled"] === false) return false;

		if("user" in window.session){
			if(window.session["user"]["roles"].includes("root")) return true;

			if("authenticity_statuses" in PAGE_CONF){
				if(PAGE_CONF["authenticity_statuses"].includes("unauthenticated")) return false;
				if(!PAGE_CONF["authenticity_statuses"].includes(session["user"]["authenticity_status"])) return false;
			}

			if("roles" in PAGE_CONF){
				let result = false;
				for(let i = 0; i < PAGE_CONF["roles"].length; i++) if(window.session["user"]["roles"].includes(PAGE_CONF["roles"][i])) result = true;
				if(result === false) return false;
			}

			if("roles_not" in PAGE_CONF){
				for(let role_not of PAGE_CONF["roles_not"]) if(window.session["user"]["roles"].includes(role_not)) return false;
			}

			if("plans" in PAGE_CONF){
				let result = false;
				for(let i = 0; i < PAGE_CONF["plans"].length; i++) if(window.session["user"]["plans"].includes(PAGE_CONF["plans"][i])) result = true;
				if(result === false) return false;
			}

			return true;
		}

		if(!("user" in window.session)){
			if(
				(
					!("authenticity_statuses" in PAGE_CONF) ||
					"authenticity_statuses" in PAGE_CONF &&
					PAGE_CONF["authenticity_statuses"].includes("unauthenticated")
				) &&
				!("roles" in PAGE_CONF) &&
				!("plans" in PAGE_CONF)
			) return true;
			else return false;
		}

		return true
	}
}

// Make Router Usable W/O Importing It
window.Router = Router;
