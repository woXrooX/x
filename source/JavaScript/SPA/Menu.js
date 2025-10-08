export default class Menu{
	static selector = "body > menu";
	static #selector_menu_hyperlinks = `${Menu.selector} > main a`;

	static #element = null;
	static #menu_show_button = null;
	static #always_open_mode_toggler = null;

	static #shown = false;

	// Modes
	static #modes = Object.freeze({
		DEFAULT: 0,
		ALWAYS_OPEN: 1,
		ICON_ONLY: 2
	});

	static #current_mode = Menu.#modes.DEFAULT;

	/////////// APIs
	static init() {
		Log.info("Menu.init()");

		Menu.#element = document.querySelector(Menu.selector);

		// Check If "body > menu" Exists
		if (!!Menu.#element === false) return;

		Menu.#menu_show_button = document.querySelector("body > x-svg[for=menu_show]");
		Menu.#always_open_mode_toggler = document.querySelector(`${Menu.selector} > header > x-svg[for=toggle_always_open_mode]`);

		Menu.#detect_current_mode();

		// Try To Build The Menu
		if (Menu.build() === false) return;

		// Init active
		Menu.set_active();

		//// Listen To The Events
		// Show menu event
		Menu.#menu_show_button.onclick = Menu.#show;
		// On Mobile menu close event
		document.querySelector(`${Menu.selector} > header > x-svg[for=menu_close_button_on_mobile]`).onclick = Menu.#hide;
		Menu.#toggle_always_open_mode();
		Cover.on_click_execute(Menu.#hide);
	}

	static build() {
		Log.info("Menu.build()");

		// Check If CONF Has Menu
		if (!("menu" in window.CONF)) return false;

		// Check If Menu Is Enabled
		if (window.CONF["menu"]["enabled"] === false) return false;

		// Add created menus into "menu > main"
		Menu.#element.querySelector("main").innerHTML = Menu.#recursive_builder(window.CONF["menu"]["menus"]);

		// After adding hyperlinks to DOM create hide event for each of the hyperlinks
		Menu.#on_click_hyperlinks();

		Menu.#toggle_sub_menus();
	}

	static set_active() {
		// Check If CONF Has Menu
		if (!("menu" in window.CONF)) return false;

		// Check If Menu Is Enabled
		if (window.CONF["menu"]["enabled"] === false) return false;

		// Hyperlinks
		const hyperlinks = document.querySelectorAll(Menu.#selector_menu_hyperlinks);

		// Find the current window.location.pathname matching page, and take the endpoints from it
		let matched_endpoints = [];
		for (const menu of window.CONF["menu"]["menus"])
			if (!("url" in menu))
				for (const endpoint of window.CONF["pages"][menu["page"]]["endpoints"])
					if (endpoint === window.location.pathname) matched_endpoints = window.CONF["pages"][menu["page"]]["endpoints"];

		// Loop through all the hyperlinks of parent menu
		for (const hyperlink of hyperlinks) {
			// De-Activate All
			hyperlink.parentElement.removeAttribute("active");

			// Activate section.parent_menu if href matches
			if (matched_endpoints.includes(hyperlink.getAttribute("href"))) hyperlink.parentElement.setAttribute("active", "");
		}
	}

	// static set_active() {
	// 	// Hyperlinks
	// 	const hyperlinks = document.querySelectorAll(Menu.#selector_menu_hyperlinks);

	// 	// loop Through All The Hyperlinks Of Parent Menu
	// 	for (const hyperlink of hyperlinks) {
	// 		// De-Activate All
	// 		hyperlink.parentElement.removeAttribute("active");

	// 		// Activate section.parentMenu if href matches
	// 		if (hyperlink.getAttribute("href") == window.location.pathname) hyperlink.parentElement.setAttribute("active", "");
	// 	}
	// }

	/////////// Helpers
	static #recursive_builder(menus) {
		let HTML = "";

		for (const menu of menus)
			if (Menu.#guard(menu) === true) {
				HTML += `
					<section class="container">
						<section class="parent_menu">
							<a href="${"url" in menu ? menu["url"] : window.CONF["pages"][menu["page"]]["endpoints"][0]}">
								${"icon" in menu ? `<x-svg color="#ffffff" name="${menu["icon"]}"></x-svg>` : ""}
								${"name" in menu ? window.Lang.use(menu["name"]) : window.Lang.use(menu["page"])}
							</a>
				`;

				// Add the sub menu toggle icon and close the section.parent_menu
				if ("sub_menu" in menu)
					HTML += `
							<x-svg for="toggle_sub_menu" color="#ffffff" name="arrow_bottom_small"></x-svg>
						</section>
						<section class="sub_menu">${Menu.#recursive_builder(menu["sub_menu"])}</section>
					`;

				// Close the section.parent_menu if no "sub_menu" in menu
				else HTML += `</section>`;

				// Close the section.container
				HTML += `</section>`;
			}

		return HTML;
	}

	static #on_click_hyperlinks() {
		const hyperlinks = document.querySelectorAll(Menu.#selector_menu_hyperlinks);

		// Assign Hide Method To On Click Event
		for (const hyperlink of hyperlinks)
			// Blank menu items
			if (hyperlink.getAttribute('href') == '') {
				const sub_menu_toggler = hyperlink.parentElement.querySelector("x-svg[for=toggle_sub_menu]");
				if (!!sub_menu_toggler === true) hyperlink.addEventListener("click", ()=>{sub_menu_toggler.click();});
			}

			// Normal menu items
			else hyperlink.addEventListener("click", Menu.#hide);
	}

	// On click x-svg[for=toggle_sub_menu] show the section.sub_menu
	static #toggle_sub_menus() {
		const sub_menu_togglers = document.querySelectorAll(`${Menu.selector} > main x-svg[for=toggle_sub_menu]`);

		for (const toggler of sub_menu_togglers)
			toggler.onclick = ()=> {
				toggler.classList.toggle("open");
				toggler.parentElement.parentElement.querySelector("section.sub_menu").classList.toggle("show");
			}
	}

	static #detect_current_mode() {
		if (localStorage.getItem("x.menu_mode")) Menu.#current_mode = parseInt(localStorage.getItem("x.menu_mode"));
		else Menu.#current_mode = Menu.#modes.DEFAULT;

		Menu.#switch_mode(Menu.#current_mode);
	}

	static #switch_mode(mode) {
		switch(mode) {
			case Menu.#modes.DEFAULT:
				Menu.#default_mode();
				break;

			case Menu.#modes.ALWAYS_OPEN:
				Menu.#always_open_mode();
				Menu.#always_open_mode_toggler.forceToggle();
				break;

			default:
				Menu.#default_mode();
				break;
		}
	}

	static #save_mode() {localStorage.setItem('x.menu_mode', Menu.#current_mode);}

	static #default_mode() {
		Log.info("Menu.#default_mode()");

		Menu.#current_mode = Menu.#modes.DEFAULT;
		Menu.#save_mode();

		if (Menu.#shown) window.Cover.show();
		Menu.#element.classList.remove("always_open_mode");
	}

	static #always_open_mode() {
		Log.info("Menu.#always_open_mode()");

		Menu.#current_mode = Menu.#modes.ALWAYS_OPEN;
		Menu.#save_mode();

		window.Cover.hide();
		Menu.#element.classList.add("always_open_mode");
	}

	static #toggle_always_open_mode() {
		Menu.#always_open_mode_toggler.addEventListener("click", ()=>{
			if (Menu.#current_mode === Menu.#modes.ALWAYS_OPEN) Menu.#default_mode();
			else Menu.#always_open_mode();
		});
	}

	static #show() {
		// Check If Already Shown
		if (Menu.#shown) return;

		// Check if body > menu exists
		if (!!Menu.#element === false) return;

		Menu.#element.classList.add("show");

		window.Cover.show();

		Menu.#shown = true;
	}

	static #hide() {
		// Check If Already Hidden
		if (Menu.#shown === false) return;

		// Check if body > menu exists
		if (!!Menu.#element === false) return;

		Menu.#element.classList.remove("show");

		window.Cover.hide();

		Menu.#shown = false;
	}

	static #guard(menu) {
		///// Menu to a custom URL
		if ("url" in menu) {
			if ("name" in menu) return true;
			return false;
		}

		///// Page linked menu
		// Check if menu linked page exists in CONF["pages"]
		if (!(menu["page"] in window.CONF["pages"])) return false;

		// Check if menu linked page is enabled in CONF["pages"]
		if (window.CONF["pages"][menu["page"]]["enabled"] == false) return false;

		return window.x.Router.guard(menu["page"]);
	}
}

window.Menu = Menu;
