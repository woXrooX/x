"use strict";

export default class Menu{
	static selector = "body > menu";
	static #selectorMenuHyperlinks = `${Menu.selector} > main a`;

	static #element = null;
	static #showMenuButton = null;
	static #alwaysOpenModeTogler = null;

	static #shown = false;

	// Modes
	static #modes = Object.freeze({
		DEFAULT: 0,
		ALWAYS_OPEN: 1,
		ICON_ONLY: 2
	});

	static init(){
		Log.info("Menu.init()");

		Menu.#element = document.querySelector(Menu.selector);

		// Check If "body > menu" Exists
		if(!!Menu.#element === false) return;

		Menu.#showMenuButton = document.querySelector("body > x-svg[for=showMenu]");
		Menu.#alwaysOpenModeTogler = document.querySelector(`${Menu.selector} > header > x-svg[for=toggleAlwaysOpenMode]`);

		Menu.#detectCurrentMode();

		// Try To Build The Menu
		if(Menu.build() === false) return;

		// Init active
		Menu.set_active();

		//// Listen To The Events
		// Show menu event
		Menu.#showMenuButton.onclick = Menu.#show;
		// On Mobile menu close event
		document.querySelector(`${Menu.selector} > header > x-svg[for=menuCloseButtonMobile]`).onclick = Menu.#hide;
		Menu.#toggleAlwaysOpenMode();
		Cover.onClickExecute(Menu.#hide);
	}

	static build(){
		Log.info("Menu.build()");

		// Check If CONF Has Menu
		if(!("menu" in window.CONF)) return false;

		// Check If Menu Is Enabled
		if(window.CONF["menu"]["enabled"] === false) return false;

		// Add created menus into "menu > main"
		Menu.#element.querySelector("main").innerHTML = Menu.#recursiveBuilder(window.CONF["menu"]["menus"]);

		// After adding hyperlinks to DOM create hide event for each of the hyperlinks
		Menu.#on_click_hyperlinks();

		Menu.#toggleSubMenus();
	}

	static #recursiveBuilder(menus){
		let HTML = "";

		for(const menu of menus)
			if(Menu.#guard(menu) === true){
				HTML += `
					<section class="container">
						<section class="parentMenu">
							<a href="${"url" in menu ? menu["url"] : window.CONF["pages"][menu["page"]]["endpoints"][0]}">
								${"icon" in menu ? `<x-svg color="#ffffff" name="${menu["icon"]}"></x-svg>` : ""}
								${"name" in menu ? window.Lang.use(menu["name"]) : window.Lang.use(menu["page"])}
							</a>
				`;

				// Add the sub menu toggle icon and close the section.parentMenu
				if("subMenu" in menu)
					HTML += `
							<x-svg for="toggleSubMenu" color="#ffffff" name="arrow_bottom_small"></x-svg>
						</section>
						<section class="subMenu">${Menu.#recursiveBuilder(menu["subMenu"])}</section>
					`;

				// Close the section.parentMenu if no "subMenu" in menu
				else HTML += `</section>`;

				// Close the section.container
				HTML += `</section>`;
			}

		return HTML;
	}

	static #on_click_hyperlinks(){
		const hyperlinks = document.querySelectorAll(Menu.#selectorMenuHyperlinks);

		// Assign Hide Method To On Click Event
		for(const hyperlink of hyperlinks)
			// Blank menu items
			if(hyperlink.getAttribute('href') == ''){
				const subMenu_toggler = hyperlink.parentElement.querySelector("x-svg[for=toggleSubMenu]");
				if(!!subMenu_toggler === true) hyperlink.addEventListener("click", ()=>{subMenu_toggler.click();});
			}

			// Normal menu items
			else hyperlink.addEventListener("click", Menu.#hide);
	}

	// On click x-svg[for=toggleSubMenu] show the section.subMenu
	static #toggleSubMenus(){
		const subMenuTogglers = document.querySelectorAll(`${Menu.selector} > main x-svg[for=toggleSubMenu]`);

		for(const toggler of subMenuTogglers)
			toggler.onclick = ()=> {
				toggler.classList.toggle("open");
				toggler.parentElement.parentElement.querySelector("section.subMenu").classList.toggle("show");
			}
	}

	static set_active(){
		// Hyperlinks
		const hyperlinks = document.querySelectorAll(Menu.#selectorMenuHyperlinks);

		// loop Through All The Hyperlinks Of Parent Menu
		for(const hyperlink of hyperlinks){
			// De-Activate All
			hyperlink.parentElement.removeAttribute("active");

			// Activate section.parentMenu if href matches
			if(hyperlink.getAttribute("href") == window.location.pathname) hyperlink.parentElement.setAttribute("active", "");
		}
	}

	static #detectCurrentMode(){
		if(localStorage.getItem("x.menu_mode")) Menu.currentMode = parseInt(localStorage.getItem("x.menu_mode"));
		else Menu.currentMode = Menu.#modes.DEFAULT;

		Menu.#switchMode(Menu.currentMode);
	}

	static #switchMode(mode){
		switch(mode){
			case Menu.#modes.DEFAULT:
				this.#defaultMode();
				break;

			case Menu.#modes.ALWAYS_OPEN:
				this.#alwaysOpenMode();
				Menu.#alwaysOpenModeTogler.forceToggle();
				break;

			default:
				this.#defaultMode();
				break;
		}
	}

	static #saveMode(){localStorage.setItem('x.menu_mode', Menu.currentMode);}

	static #defaultMode(){
		Log.info("Menu.#defaultMode()");

		Menu.currentMode = Menu.#modes.DEFAULT;
		this.#saveMode();

		if(Menu.#shown) window.Cover.show();
		Menu.#element.classList.remove("alwaysOpenMode");
	}

	static #alwaysOpenMode(){
		Log.info("Menu.#alwaysOpenMode()");

		Menu.currentMode = Menu.#modes.ALWAYS_OPEN;
		this.#saveMode();

		window.Cover.hide();
		Menu.#element.classList.add("alwaysOpenMode");
	}

	static #toggleAlwaysOpenMode(){
		Menu.#alwaysOpenModeTogler.addEventListener("click", ()=>{
			if(Menu.currentMode === Menu.#modes.ALWAYS_OPEN) Menu.#defaultMode();
			else Menu.#alwaysOpenMode();
		});
	}

	static #show(){
		// Check If Already Shown
		if(Menu.#shown) return;

		// Check if body > menu exists
		if(!!Menu.#element === false) return;

		Menu.#element.classList.add("show");

		window.Cover.show();

		Menu.#shown = true;
	}

	static #hide(){
		// Check If Already Hidden
		if(Menu.#shown === false) return;

		// Check if body > menu exists
		if(!!Menu.#element === false) return;

		Menu.#element.classList.remove("show");

		window.Cover.hide();

		Menu.#shown = false;
	}

	static #guard(menu){
		///// Menu to a custom URL
		if("url" in menu){
			if("name" in menu) return true;
			return false;
		}

		///// Page linked menu
		// Check if menu linked page exists in CONF["pages"]
		if(!(menu["page"] in window.CONF["pages"])) return false;

		// Check if menu linked page is enabled in CONF["pages"]
		if(window.CONF["pages"][menu["page"]]["enabled"] == false) return false;

		return window.Router.routeGuard(menu["page"]);
	}
}

window.Menu = Menu;
