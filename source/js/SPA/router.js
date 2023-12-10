"use strict";

export default class Router{
	static currentPage = {
		"name": null,
		"endpoint": null,
		"urlArgs": null
	}

	static async handle(){
		// Check If App Is Down If So Stop Handling Set appIsDown As Current Page
		if("appIsDown" in window.CONF["default"]){
			window.DOM.setPage(await import(`../pages/appIsDown.js`));

			// Force-End Loading Effect
			window.Loading.end();

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

			// If Url Args Exists In This Page Drop Url Arguments From The Path Name
			// If Url Args Exists In This Page Extract Url Arguments From The Path Name
			if(window.CONF.pages[page]?.urlArgs){
				//// NOTE: Order Matters In This Scope

				// Current Page Arguments
				Router.currentPage.urlArgs = pathname.split('/').splice(-window.CONF.pages[page].urlArgs.length);

				// Modified Path Name
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

		// If Still No Endpoint Matched Then Set It To "pageNotFound" AKA 404
		if(Router.currentPage.name === null) Router.currentPage.name = "pageNotFound";

		// Load Page File
		Router.#loadPageFile();

	}

	static async #loadPageFile(){
		window.Log.info(`Page file is loading: ${Router.currentPage.name}.js`)

		try{
			// Start Loading Effect
			window.Loading.start();

			// Change URL To /404 In Case endpoint Is /404
			// Currntly causing infintive back and forth page looping
			// if(endpoint === "/404") window.history.pushState("", "", URL+"404");

			// Load The Page
			window.DOM.setPage(await import(`../pages/${Router.currentPage.name}.js`));
		}catch(error){
			// console.log(error);
			// console.log(error.name);
			// console.log(error.stack);

			// Set Title To Error
			window.Title.set("error");

			// Render The Error
			window.DOM.render(`
				<container class="p-5">
					<column class="flex-y-start surface-error p-3 gap-0-5">
						<error>${error.name}</error>
						<info class="text-size-0-8">${error.stack}</info>
					</column>
				</container>
			`);
		}finally{
			// End Loading Effect
			window.Loading.end();
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

			///// Plans - similar to role check
			let plan_check = true; // Should be false in actual implementation

			///// Final Check: IF All Checks Passed
			if(
				authenticity_check === true &&
				role_check === true &&
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
