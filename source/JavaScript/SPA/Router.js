// NOTE: Static (literal) URLs (e.g. "/page/test") can be swallowed by dynamic ones ("/page/<arg>").

export default class Router {
	/////////////////////////// Static

	static #endpoint_Regex_cache = new Map();

	static current_route = {
		"name": null,
		"endpoint": null,
		"full_URL": null,
		"URL_args": {}
	}

	/////////// APIs

	static async handle() {
		// Check if app is down if so stop handling and set app_is_down as a current page
		if ("app_is_down" in window.CONF["tools"]) {
			Router.current_route.name = "app_is_down";
			Router.#init_load_page();
			return;
		}

		// Check the "window.location.pathname" for the error URLs
		if (Router.error_handlers() === true) {
			Router.#init_load_page();
			return;
		}

		loop_pages: for (const page in window.CONF["pages"]) {
			if (Router.guard(page) === false) continue;

			const pathname = window.location.pathname;

			loop_endpoints: for (const endpoint of window.CONF["pages"][page]["endpoints"]) {
				const URL_args = Router.#match_endpoint(endpoint, pathname);

				if (URL_args) {
					if (
						Router.current_route.name == page &&
						Object.keys(Router.current_route.URL_args).length === 0
					) return;

					Router.current_route.name = page;
					Router.current_route.endpoint = endpoint;
					Router.current_route.URL_args = URL_args;
					Router.current_route.full_URL = window.location.href;

					Router.#init_load_page();
					return;
				}
			}
		}

		// If no match, reset the "current_route" and load the "404" page
		Router.#reset_current_route();
		Router.current_route.name = "404";
		Router.#init_load_page();
	}

	static error_handlers() {
		switch(window.location.pathname) {
			case "/400":
				Router.current_route.name = "400";
				return true;

			case "/403":
				Router.current_route.name = "403";
				return true;

			case "/404":
				Router.current_route.name = "404";
				return true;

			default: return false;
		}
	}

	static guard(page) {
		const PAGE_CONF = window.CONF["pages"][page]

		if (PAGE_CONF["enabled"] === false) return false;

		if ("user" in window.session) {
			if (window.session["user"]["roles"].includes("root")) return true;

			if ("authenticity_statuses" in PAGE_CONF) {
				if (PAGE_CONF["authenticity_statuses"].includes("unauthenticated")) return false;
				if (!PAGE_CONF["authenticity_statuses"].includes(session["user"]["authenticity_status"])) return false;
			}

			if ("roles" in PAGE_CONF) {
				let result = false;
				for (let i = 0; i < PAGE_CONF["roles"].length; i++) if (window.session["user"]["roles"].includes(PAGE_CONF["roles"][i])) result = true;
				if (result === false) return false;
			}

			if ("roles_not" in PAGE_CONF) {
				for (let role_not of PAGE_CONF["roles_not"]) if (window.session["user"]["roles"].includes(role_not)) return false;
			}

			if ("plans" in PAGE_CONF) {
				let result = false;
				for (let i = 0; i < PAGE_CONF["plans"].length; i++) if (window.session["user"]["plans"].includes(PAGE_CONF["plans"][i])) result = true;
				if (result === false) return false;
			}

			return true;
		}

		if (!("user" in window.session)) {
			if (
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

	/////////// Helpers

	static async #init_load_page() {
		try{
			if (window.x.Page.current_page !== null && !!window.x.Page.current_page.on_page_unmount === true) await window.x.Page.current_page.on_page_unmount();

			// Start loading effects
			window.Loading.start();
			window.Main.animation_start();

			// Load page file
			await window.x.Page.load_file(Router.current_route.name);
		}

		catch(error) {
			// Log.line();
			// Log.error(error);
			// Log.error(error.name);
			// Log.error(error.message);
			// Log.error(error.stack);
			// Log.line();

			window.Header.handle();

			if ("CONF" in window && window.CONF.tools.debug === true) {
				window.Main.render(Main.situational_content("error", error.name, error.stack));
				console.trace(error);
			}

			else window.Main.render(Main.situational_content("warning", Lang.use("warning"), Lang.use("something_went_wrong")));

			window.Footer.handle();
		}

		finally{
			// End loading effects
			window.Loading.end();
			window.Main.animation_end();
			window.x.URL.handle_scroll_to_hash();
		}
	}

	static #reset_current_route() {
		Router.current_route = {
			"name": null,
			"endpoint": null,
			"full_URL": null,
			"URL_args": {}
		}
	}

	// Convert "/path1/<arg1>/path2/<arg2>" to ^/path1/(?<arg1>[^/]+)/path2/(?<arg2>[^/]+)/?$ and cache it
	static #endpoint_to_RegEx(pattern) {
		// Return cached compiled RegEx if available
		const cached = Router.#endpoint_Regex_cache.get(pattern);
		if (cached) return cached;

		let src = "^";
		for (let i = 0; i < pattern.length; ) {
			const character = pattern[i];

			if (character === "<") {
				const end = pattern.indexOf(">", i + 1);

				// Unclosed param in endpoint
				if (end === -1) return false;

				const name = pattern.slice(i + 1, end).trim();

				// Empty param name in endpoint
				if (!name) return false;

				// One path segment (no slashes)
				src += `(?<${name}>[^/]+)`;
				i = end + 1;
			}

			else {
				// Escape regex specials in literal text
				const specials = "\\.^$|?*+()[]{}";
				src += specials.includes(character) ? `\\${character}` : character;
				i++;
			}
		}

		src += "/?$";

		const RegEx = new RegExp(src);
		Router.#endpoint_Regex_cache.set(pattern, RegEx);
		return RegEx;
	}

	static #match_endpoint(pattern, pathname) {
		const RegEx = Router.#endpoint_to_RegEx(pattern);
		const match = RegEx.exec(pathname);

		if (!match) return null;

		const groups = match.groups || {};

		const URL_args = {};

		for (const [key, value] of Object.entries(groups)) URL_args[key] = decodeURIComponent(value);

		return URL_args;
	}
}

window.x["Router"] = Router;
