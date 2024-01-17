"use strict";

export default class Menu{
	static selector = "body > menu";
	static #selectorMenuButton = "body > x-icon[for=menu]";
	static #selectorMenuHyperlinks = `${Menu.selector} > main a`;

	static #element = null;
	static #elementMenuButton = null;

	static #shown = false;

	// Modes
	static #modes = Object.freeze({
		DEFAULT: 0,
		ALWAYS_OPEN: 1,
		ICON_ONLY: 2
	});

  	static currentMode = Menu.#modes.DEFAULT;

	/////////////////// Init
	static init(){
		Log.info("Menu.init()");

		Menu.#element = document.querySelector(Menu.selector);
		Menu.#elementMenuButton = document.querySelector(Menu.#selectorMenuButton);

		// Check If "body > menu" Exists
		if(!!Menu.#element === false) return;

		// Try To Build The Menu
		if(Menu.build() === false) return;

		// Init active
		Menu.setActive();

		// Listen To The Events
		Menu.#onClickMenuButtonShow();
		Menu.#onClickCloseMenuInMobile();
		Menu.#toggleAlwaysOpenMode();
		Cover.onClickExecute(Menu.#hide);
	}

	/////////////////// Create Menu | Re-Build
	static build(){
		Log.info("Menu.build()");

		// Check If CONF Has Menu
		if(!("menu" in window.CONF)) return false;

		// Check If Menu Is Enabled
		if(window.CONF["menu"]["enabled"] === false) return false;

		// Add created menus into "menu > main"
		Menu.#element.querySelector("main").innerHTML = Menu.#recursiveBuilder(window.CONF["menu"]["menus"]);

		// After adding hyperlinks to DOM create hide event for each of the hyperlinks
		Menu.#onClickHyperlinksHide();

		Menu.#showSubMenuOnClickArrow();
	}

	// Menu HTML builder
	static #recursiveBuilder(menus){
		let HTML = "";

		for(const menu of menus)
			if(Menu.#guard(menu["page"]) === true){

				HTML += `
					<section class="container">
						<section class="parentMenu">
							<a href="${window.CONF["pages"][menu["page"]]["endpoints"][0]}">
								${"icon" in menu ? `<x-icon color="#ffffff" name="${menu["icon"]}"></x-icon>` : ""}
								${"name" in menu ? window.Lang.use(menu["name"]) : window.Lang.use(menu["page"])}
							</a>
				`;

				// Add the sub menu toggle icon and close the section.parentMenu
				if("subMenu" in menu)
					HTML += `
							<x-icon for="toggleSubMenu" color="#ffffff" name="arrow_bottom_small"></x-icon>
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

	/////////////////// On Click Events
	// Active
	static setActive(){
		// Hyperlinks
		const hyperlinks = document.querySelectorAll(Menu.#selectorMenuHyperlinks);

		// loop Through All The Hyperlinks Of Parent Menu
		for(const hyperlink of hyperlinks){
			// De-Activate All
			hyperlink.parentElement.removeAttribute("active");

			// Activate section.parentMenu if href matches
			if(hyperlink.getAttribute("href") == window.location.pathname) hyperlink.parentElement.setAttribute("active", "");

			// Else active the first section.parentMenu
			else if(window.location.pathname == "/" || window.location.pathname == "" || window.location.pathname == "/home")
				document.querySelector(`${Menu.#selectorMenuHyperlinks}:first-child`).parentElement.setAttribute("active", "");

		}
	}

	// On Click Menu Button Show The Menu
	static #onClickMenuButtonShow(){Menu.#elementMenuButton.onclick = Menu.#show;}

	// On Click Menu Button Close In Mobile
	static #onClickCloseMenuInMobile(){document.querySelector(`${Menu.selector} > header > x-icon[for=closeMenuInMobile]`).onclick = Menu.#hide;}

	// On click hperlinks hide the Menu
	static #onClickHyperlinksHide(){
		const hyperlinks = document.querySelectorAll(Menu.#selectorMenuHyperlinks);

		// Assign Hide Method To On Click Event
		for(const hyperlink of hyperlinks) hyperlink.addEventListener("click", Menu.#hide);
	}

	// On click x-icon[for=toggleSubMenu] show the section.subMenu
	static #showSubMenuOnClickArrow(){
		const subMenuTogglers = document.querySelectorAll(`${Menu.selector} > main x-icon[for=toggleSubMenu]`);

		for(const toggler of subMenuTogglers)
			toggler.onclick = ()=> {
				toggler.classList.toggle("open");
				toggler.parentElement.parentElement.querySelector("section.subMenu").classList.toggle("show");
			}
	}

	/////////////////// Tools
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

		// Check If Current Mode Is "ALWAYS_OPEN" Mode
		if(Menu.currentMode === Menu.#modes.ALWAYS_OPEN) return;

		// Check if body > menu exists
		if(!!Menu.#element === false) return;

		Menu.#element.classList.remove("show");

		window.Cover.hide();

		Menu.#shown = false;
	}

	static #toggleAlwaysOpenMode(){
		Log.info("Menu.#toggleAlwaysOpenMode()");

		const toggler = document.querySelector(`${Menu.selector} > header > x-icon[for=toggleAlwaysOpenMode]`);

		const header = document.querySelector(window.Header.selector);
		const main = document.querySelector(window.Main.selector);
		const footer = document.querySelector(window.Footer.selector);

		toggler.addEventListener("click", ()=>{
			// DEFAULT
			if(Menu.currentMode === Menu.#modes.ALWAYS_OPEN){
				// Mode Change To "DEFAULT"
				Menu.currentMode = Menu.#modes.DEFAULT;

				window.Cover.show();

				// Show Hamburger Button
				Menu.#elementMenuButton.style.visibility = "visible";

				// Remove Background Color Inline Rule
				Menu.#element.style.removeProperty('background-color');

				// Header, Main, Footer Maximize
				// Remove Only What Was Added Not Entire Style Atribute Values
				for(const element of [header, main, footer]){
					element.style.removeProperty('width');
					element.style.removeProperty('margin-left');
				}

			// ALWAYS_OPEN
			}else{
				// Mode Change To "ALWAYS_OPEN"
				Menu.currentMode = Menu.#modes.ALWAYS_OPEN;

				window.Cover.hide();

				// Hide Hamburger Button
				Menu.#elementMenuButton.style.visibility = "hidden";

				// Change Menu Background Color To Darker Brand Hue Based Color So It Will Look Nicer On Light Mode
				Menu.#element.style.backgroundColor = `hsla(${CSS.getValue("--color-main-hue")}, 10%, 20%, 1)`;

				// Get Live Calculated Menu Width
				const menuWidth = Menu.#element.offsetWidth + "px";

				// Header, Main, Footer Minimize
				for(const element of [header, main, footer]){
					element.style.width = `calc(100% - ${menuWidth})`;
					element.style.marginLeft = menuWidth;
				}
			}
		});
	}

	// Guard
	static #guard(menu){
		// Check If Menu Is Enabled
		// Done At Menu.init()

		// Check If Menu Linked Page Exists In CONF["pages"]
		if(!(menu in window.CONF["pages"])) return false;

		// Check If Menu Linked Page Is Enabled In CONF["pages"]
		if(window.CONF["pages"][menu]["enabled"] == false) return false;

		// Use Route Guard To Check Menus
		return window.Router.routeGuard(menu);
	}
}

// Make Menu Usable W/O Importing It
window.Menu = Menu;
