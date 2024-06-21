"use strict";

export default class Router{
	static currentPage = {
		"name": null,
		"endpoint": null,
		"urlArgs": {}
	}

	static async handle(){
		// Check If App Is Down If So Stop Handling Set app_is_down As Current Page
		if("app_is_down" in window.CONF["tools"]){
			Router.currentPage.name = "app_is_down";
			Router.#loadPageFile();
			return;
		}

		// Check the "window.location.pathname" for the error URLs
		if(Router.errorHandlers() === true){
			Router.#loadPageFile();
			return;
		}

		// NOTE: We have much efficient way of detecting "if page exists" if we give up on endpoints system
		// Loop Through Pages
		loopPages:
		for(const page in window.CONF["pages"]){
			// Pass The Page To routeGuard Tests
			if(Router.routeGuard(page) === false) continue;

			// Window Path Name
			let pathname = window.location.pathname;

			if("urlArgs" in window.CONF.pages[page]){
				//// NOTE: Order Matters In This Scope

				// Create array of URL arguments from the "pathname"
				const args = pathname.split('/').splice(-window.CONF.pages[page].urlArgs.length);

				// Assign key value pairs of URL arguments inside "Router.currentPage.urlArgs"
				for(let index = 0; index < args.length; index++) Router.currentPage.urlArgs[window.CONF.pages[page].urlArgs[index]] = args[index];

				// Extract URL arguments from the "pathname"
				pathname = pathname.split('/').slice(0, -window.CONF.pages[page].urlArgs.length).join('/');
			}

			// Endpoints
			loopEndpoints:
			for(const endpoint of window.CONF["pages"][page]["endpoints"])
				// Check If Page Endpoint Equals To Currnt Endpoint
				if(endpoint == pathname){
					//// Check If Page Is Not Current Loaded Page
					// If yes then exit this method
					// NOTE: endpoint should be unique.
					// Page a and page b can not have the same endpoint.
					// It may seem working but there will be bugs.
					// It will make return false the expression below in rare cases.
					if(
						Router.currentPage.endpoint == pathname ||
						Router.currentPage.endpoint === "home" && pathname === '/'
					) return;

					Router.currentPage.name = page;
					Router.currentPage.endpoint = endpoint;

					// Break Out The Loops
					break loopPages;
				}
		}

		// If Still No Endpoint Matched Then Set It To "404"
		if(Router.currentPage.name === null) Router.currentPage.name = "404";

		// Load Page File
		Router.#loadPageFile();
	}

	static async #loadPageFile(){
		window.Log.info(`Page file is loading: ${Router.currentPage.name}.js`);

		try{
			// Start Loading Effects
			window.Loading.start();
			window.Main.animationStart();

			// Load The Page
			await window.DOM.set_page(await import(`/js/pages/${Router.currentPage.name}.js`));
		}catch(error){
			Log.line();
			Log.error(error);
			Log.error(error.name);
			Log.error(error.stack);
			Log.line();

			// Set Title To Error
			window.Title.set("error");

			window.Header.handle();

			window.DOM.render(DOM.render(Main.situationalContent("error", error.name, error.stack)));

			window.Footer.handle();
		}finally{
			// End Loading Effects
			window.Loading.end();
			window.Main.animationEnd();
		}
	}

	static errorHandlers(){
		switch(window.location.pathname){
			case "/400":
				Router.currentPage.name = "400";
				return true;

			case "/403":
				Router.currentPage.name = "403";
				return;

			case "/404":
				Router.currentPage.name = "404";
				return true;

			default: return false;
		}
	}

	static routeGuard(page){
		// Check If Page Exists
		// Already Looping Through Existent Pages


		// Check If Page Is Enabled
		if(window.CONF["pages"][page]["enabled"] === false) return false;


		// Everyone
		if(
			!("authenticity_statuses" in window.CONF["pages"][page]) &&
			!("roles" in window.CONF["pages"][page]) &&
			!("plans" in window.CONF["pages"][page])
		) return true;


		// Session Dependent Checks
		if("user" in window.session){
			// Root
			if(window.session["user"]["roles"].includes("root")) return true;


			///// Authenticity Statuses
			let authenticity_check = false;
			if("authenticity_statuses" in window.CONF["pages"][page]){
				for(const authenticity_status in window.USER_AUTHENTICITY_STATUSES)
					if(
						window.session["user"]["authenticity_status"] == window.USER_AUTHENTICITY_STATUSES[authenticity_status]["id"] &&
						window.CONF["pages"][page]["authenticity_statuses"].includes(authenticity_status)
					) authenticity_check = true;
			}else authenticity_check = true;


			///// Roles
			let role_check = false;
			if("roles" in window.CONF["pages"][page]){
				// Check If One Of The User Assigned Roles Match With The CONF[page]["roles"]
				for(let i = 0; i < window.session["user"]["roles"].length; i++)
					if(window.CONF["pages"][page]["roles"].includes(window.session["user"]["roles"][i])){
						role_check = true;
						break;
					}
			}else role_check = true;


			///// Roles not (Not allowed roles)
			let role_not_check = true;
			if("roles_not" in window.CONF["pages"][page])
				// Check if one of the user assigned roles match with the CONF[page]["roles_not"]
				for(let i = 0; i < window.session["user"]["roles"].length; i++)
					if(window.CONF["pages"][page]["roles_not"].includes(window.session["user"]["roles"][i])){
						role_not_check = false;
						break;
					}


			///// Plans
			let plan_check = true;
			if("plans" in window.CONF["pages"][page])
				if(!window.CONF["pages"][page]["plans"].includes(window.session["user"]["plan"])) role_check = false;


			///// Final Check: IF All Checks Passed
			if(
				authenticity_check === true &&
				role_check === true &&
				role_not_check === true &&
				plan_check === true
			) return true;
		}


		// Session Independent Checks
		if(!("user" in window.session)){
			///// Authenticity Statuses
			let authenticity_check = false;

			// Unauthenticated User
			if(
				!("authenticity_statuses" in window.CONF["pages"][page]) ||
				"authenticity_statuses" in window.CONF["pages"][page] &&
				window.CONF["pages"][page]["authenticity_statuses"].includes("unauthenticated")
			) authenticity_check = true;

			///// Roles
			let role_check = false;
			if(!("roles" in window.CONF["pages"][page])) role_check = true;

			///// Plans
			let plan_check = false;
			if(!("plans" in window.CONF["pages"][page])) plan_check = true;

			///// Final Check: IF All Checks Passed
			if(
				authenticity_check === true &&
				role_check === true &&
				plan_check === true
			) return true;
		}


		// Failed The Guard Checks
		return false;
	}
}

// Make Router Usable W/O Importing It
window.Router = Router;
