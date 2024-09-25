"use strict";

export default class Router{
	static current_page = {
		"name": null,
		"endpoint": null,
		"full_URL": null,
		"url_args": {}
	}

	static async handle(){
		// Check If App Is Down If So Stop Handling Set app_is_down As Current Page
		if("app_is_down" in window.CONF["tools"]){
			Router.current_page.name = "app_is_down";
			Router.#load_page_file();
			return;
		}

		// Check the "window.location.pathname" for the error URLs
		if(Router.errorHandlers() === true){
			Router.#load_page_file();
			return;
		}

		// NOTE: We have much efficient way of detecting "if page exists" if we give up on endpoints system
		// Loop Through Pages
		loop_pages:
		for(const page in window.CONF["pages"]){
			if(Router.guard(page) === false) continue;

			// Window Path Name
			let pathname = window.location.pathname;

			if("url_args" in window.CONF.pages[page]){
				//// NOTE: Order Matters In This Scope

				// Create array of URL arguments from the "pathname"
				const args = pathname.split('/').splice(-window.CONF.pages[page].url_args.length);

				// Assign key value pairs of URL arguments inside "Router.current_page.url_args"
				for(let index = 0; index < args.length; index++) Router.current_page.url_args[window.CONF.pages[page].url_args[index]] = args[index];

				// Extract URL arguments from the "pathname"
				pathname = pathname.split('/').slice(0, -window.CONF.pages[page].url_args.length).join('/');
			}

			// Endpoints
			loop_endpoints:
			for(const endpoint of window.CONF["pages"][page]["endpoints"])
				// Check If Page Endpoint Equals To Currnt Endpoint
				if(endpoint == pathname){
					//// Check If Page Is Not Current Loaded Page
					// TODO: We need to create a endpoints matching loop like in thr  Menu.set_active() in order to fix issues like "/" and "/home" are being rendered even the page is thesame
					// NOTE: endpoint should be unique.
					// Page a and page b can not have the same endpoint. It may seem working but there will be bugs. It will make return false the expression below in rare cases.
					// If yes then exit this method
					if(Router.current_page.full_URL === window.location.href) return;

					Router.current_page.name = page;
					Router.current_page.endpoint = endpoint;
					Router.current_page.full_URL = window.location.href;

					// Break Out The Loops
					break loop_pages;
				}
		}

		// If Still No Endpoint Matched Then Set It To "404"
		if(Router.current_page.name === null) Router.current_page.name = "404";

		// Load Page File
		Router.#load_page_file();
	}

	static async #load_page_file(){
		window.Log.info(`Page file is loading: ${Router.current_page.name}.js`);

		try{
			// Start Loading Effects
			window.Loading.start();
			window.Main.animation_start();

			// Load The Page
			await window.DOM.set_page(await import(`/js/pages/${Router.current_page.name}.js`));
		}catch(error){
			Log.line();
			console.trace(error);
			// Log.error(error);
			// Log.error(error.name);
			// Log.error(error.message);
			// Log.error(error.stack);
			Log.line();

			window.Header.handle();

			window.DOM.render(Main.situational_content("error", error.name, error.stack));

			window.Footer.handle();
		}finally{
			// End Loading Effects
			window.Loading.end();
			window.Main.animation_end();
		}
	}

	static errorHandlers(){
		switch(window.location.pathname){
			case "/400":
				Router.current_page.name = "400";
				return true;

			case "/403":
				Router.current_page.name = "403";
				return;

			case "/404":
				Router.current_page.name = "404";
				return true;

			default: return false;
		}
	}

	static guard(page){
		// Check If Page Exists
		// Already Looping Through Existent Pages

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
				let result = true;
				for(let i = 0; i < PAGE_CONF["roles_not"].length; i++) if(window.session["user"]["roles"].includes(PAGE_CONF["roles_not"][i])) result = false;
				if(result === false) return false;
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
