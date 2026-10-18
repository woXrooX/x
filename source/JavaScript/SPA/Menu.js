export default class Menu {
	/////////////////////////// Static

	/////////// Variables

	static selector = "body > menu";

	static #element = null;
	static #main = null;
	static #menu_show_button = null;
	static #always_open_mode_toggler = null;

	static #shown = false;

	static #modes = Object.freeze({
		DEFAULT: 0,
		ALWAYS_OPEN: 1,
		ICON_ONLY: 2
	});

	static #current_mode = Menu.#modes.DEFAULT;


	/////////// APIs

	static async init() {
		Log.info("Menu.init()");


		Menu.#element = document.querySelector(Menu.selector);
		if (!!Menu.#element === false) return;


		Menu.#main = Menu.#element.querySelector(":scope > main");
		Menu.#menu_show_button = document.querySelector("body > x-svg[for=menu_show]");
		Menu.#always_open_mode_toggler = Menu.#element.querySelector(":scope > header > x-svg[for=toggle_always_open_mode]");


		Menu.#load_mode();


		//// Events

		Menu.#menu_show_button.addEventListener("click", Menu.#show);
		Menu.#element.querySelector(":scope > header > x-svg[for=menu_close_button_on_mobile]").addEventListener("click", Menu.hide);
		Menu.#always_open_mode_toggler.addEventListener("click", Menu.#toggle_always_open_mode);
		Menu.#main.addEventListener("click", Menu.#toggle_sub_menu);
		window.Cover.on_click_execute(Menu.hide);


		await Menu.build();
	}

	static async build() {
		Log.info("Menu.build()");

		if (!!Menu.#element === false) return;

		const menus = await Menu.#load();
		if (menus === false) return Menu.#disable();

		const nodes = Menu.#normalize_menus(menus);
		if (nodes.length === 0) return Menu.#disable();

		Menu.#main.innerHTML = Menu.#render(nodes);
		Menu.#enable();
		Menu.set_active();
	}

	static set_active() {
		if (!!Menu.#element === false) return;

		const current_page = window.x.Router.current_route["name"];

		for (const parent_menu of Menu.#main.querySelectorAll("section.parent_menu")) {
			if (parent_menu.getAttribute("page") !== current_page) {
				parent_menu.removeAttribute("active");

				continue;
			}

			parent_menu.setAttribute("active", '');
			Menu.#open_ancestors(parent_menu);
		}
	}

	static hide() {
		if (Menu.#shown === false) return;

		Menu.#element.classList.remove("show");
		window.Cover.hide();
		Menu.#shown = false;
	}


	/////////// Helpers

	static async #load() {
		try {
			const menu_module = await import("/JavaScript/modules/menu.js");

			if (typeof menu_module.default !== "function") return false;

			const menus = await menu_module.default();

			return Array.isArray(menus) ? menus : false;
		}

		catch (error) {
			Log.error(`Print failed: ${error}`);

			return false;
		}
	}

	// Resolves raw menus into render-ready nodes, dropping anything the current user can't access
	static #normalize_menus(menus) {
		const nodes = [];

		for (const menu of menus) {
			const node = Menu.#normalize_menu(menu);

			if (node !== null) nodes.push(node);
		}

		return nodes;
	}

	static #normalize_menu(menu) {
		const icon = "icon" in menu ? menu["icon"] : null;
		const sub_menu = "sub_menu" in menu ? Menu.#normalize_menus(menu["sub_menu"]) : [];


		//// Page menu

		if ("page" in menu) {
			if (window.x.Router.guard(menu["page"]) === false) return null;

			return {
				"page": menu["page"],
				"href": window.x["configurations"]["pages"][menu["page"]]["endpoints"][0],
				"label": window.Lang.use("name" in menu ? menu["name"] : menu["page"]),
				"icon": icon,
				"sub_menu": sub_menu
			};
		}


		//// URL menu or group, both need a name

		if (!("name" in menu)) return null;

		// A group with nothing accessible inside has nothing to show
		if (
			!("URL" in menu) &&
			sub_menu.length === 0
		) return null;


		return {
			"page": null,
			"href": "URL" in menu ? menu["URL"] : null,
			"label": window.Lang.use(menu["name"]),
			"icon": icon,
			"sub_menu": sub_menu
		};
	}

	// Turns normalized nodes into HTML
	static #render(nodes) {
		let HTML = '';

		for (const node of nodes) {
			const icon = node["icon"] === null ? '' : `<x-svg color="#ffffff" name="${node["icon"]}"></x-svg>`;
			const page_attribute = node["page"] === null ? '' : ` page="${node["page"]}"`;

			// Links get an anchor, pure groups get a span
			const entry = node["href"] === null ?
				`<span>${icon}${node["label"]}</span>` :
				`<a href="${node["href"]}">${icon}${node["label"]}</a>`;

			let toggler = '';
			let sub_menu_HTML = '';

			if (node["sub_menu"].length > 0) {
				toggler = `<x-svg for="toggle_sub_menu" color="#ffffff" name="arrow_bottom_small"></x-svg>`;
				sub_menu_HTML = `<section class="sub_menu">${Menu.#render(node["sub_menu"])}</section>`;
			}

			HTML += `
				<section class="container">
					<section class="parent_menu"${page_attribute}>
						${entry}
						${toggler}
					</section>

					${sub_menu_HTML}
				</section>
			`;
		}

		return HTML;
	}

	// Opens every group that contains the given item, so the active item is visible
	static #open_ancestors(parent_menu) {
		let sub_menu = parent_menu.closest("section.sub_menu");

		while (!!sub_menu === true) {
			sub_menu.parentElement.classList.add("open");
			sub_menu = sub_menu.parentElement.closest("section.sub_menu");
		}
	}

	// Click handler on main: arrow icons and group headers toggle their sub menu, links are left to the Router
	static #toggle_sub_menu(event) {
		const toggler = event.target.closest("x-svg[for=toggle_sub_menu], section.parent_menu > span");

		if (!!toggler === false) return;

		toggler.closest("section.container").classList.toggle("open");
	}

	static #enable() {
		Menu.#element.classList.remove("display-none");
		Menu.#menu_show_button.classList.remove("display-none");
	}

	static #disable() {
		Menu.hide();
		Menu.#main.innerHTML = '';
		Menu.#element.classList.add("display-none");
		Menu.#menu_show_button.classList.add("display-none");
	}

	static #show() {
		if (Menu.#shown) return;

		Menu.#element.classList.add("show");
		window.Cover.show();
		Menu.#shown = true;
	}

	static #load_mode() {
		Menu.#set_mode(parseInt(localStorage.getItem("x.menu_mode")));

		// The toggler flips its own icon on click, so it only needs syncing on load
		if (Menu.#current_mode === Menu.#modes.ALWAYS_OPEN) Menu.#always_open_mode_toggler.force_toggle();
	}

	static #set_mode(mode) {
		Log.info("Menu.#set_mode()");

		// Unknown or not yet supported modes fall back to default
		if (mode !== Menu.#modes.ALWAYS_OPEN) mode = Menu.#modes.DEFAULT;

		Menu.#current_mode = mode;
		localStorage.setItem("x.menu_mode", mode);

		if (mode === Menu.#modes.ALWAYS_OPEN) {
			Menu.#element.classList.add("always_open_mode");
			window.Cover.hide();
		}

		else {
			Menu.#element.classList.remove("always_open_mode");

			if (Menu.#shown) window.Cover.show();
		}
	}

	static #toggle_always_open_mode() {
		if (Menu.#current_mode === Menu.#modes.ALWAYS_OPEN) Menu.#set_mode(Menu.#modes.DEFAULT);
		else Menu.#set_mode(Menu.#modes.ALWAYS_OPEN);
	}
}

window.x["Menu"] = Menu;
