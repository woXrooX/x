"use strict";

export default class Menu{
  static selector = "body > menu";
  static #selectorMenuButton = "body > x-icon[for=menu]";
  static #selectorParentMenuHyperlinks = `${Menu.selector} > main > section > section.parentMenu > a`;
  static #selectorSubMenuHyperlinks = `${Menu.selector} > main > section > section.subMenu > a`;

  static #isMobile = window.matchMedia("(max-width: 600px)");

  static #elementMenuHamburgerButton = null;
  static #elementMenu = null;

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

    Menu.#elementMenuHamburgerButton = document.querySelector(Menu.#selectorMenuButton);
    Menu.#elementMenu = document.querySelector(Menu.selector);

    // Check If "body > menu" Exists
    if(!!Menu.#elementMenu === false) return;

    // Try To Build The Menu
    if(Menu.build() === false) return;

    // Init active
    Menu.setActive();

    // Listen To The Events
    Menu.#onClickMenuButtonShow();
    Menu.#onClickCoverHide();
    Menu.#toggleAlwaysOpenMode();

    if(Menu.#isMobile.matches) document.querySelector(`${Menu.selector} > header > x-icon[for=toggleAlwaysOpenMode]`).remove()
  }

  /////////////////// Create Menu | Re-Build
  static build(){
    Log.info("Menu.build()");

    // Check If CONF Has Menu
    if(!("menu" in window.CONF)) return false;

    // Check If Menu Is Enabled
    if(window.CONF["menu"]["enabled"] === false) return false;

    let menus = "";

    for(const menu of window.CONF["menu"]["menus"])
      if(Menu.#menuGuard(menu["page"]) === true)
        // Hyperlink Blue Print
        menus += `
          <section>

            <section class="parentMenu">
              <a href="${window.CONF["pages"][menu["page"]]["endpoints"][0]}">
                <x-icon color="#ffffff" name="${"icon" in menu ? menu["icon"] : menu["page"]}"></x-icon>
                ${"name" in menu ? window.Lang.use(menu["name"]) : window.Lang.use(menu["page"])}
              </a>

              ${"subMenu" in menu ? `<x-icon for="toggleSubMenu" color="#ffffff" name="arrow_bottom_small"></x-icon>` : ""}
            </section>

            <section class="subMenu">${"subMenu" in menu ? Menu.#subMenuBuilder(menu["subMenu"]) : ""}</section>

          </section>
        `;


    // Add Hyperlinks Into Menu > Main
    Menu.#elementMenu.querySelector("main").innerHTML = menus;

    // After Adding Hyperlinks To Dom Create Hide Event For Each Of The Hyperlinks
    Menu.#onClickHyperlinksHide();

    Menu.#showSubMenu();
  }

  /////////////////// On Click Events
  // Active
  static setActive(){
    ///// Parent Menu
    // Hyperlinks Of Parent Menu
    const hyperlinksParentMenu = document.querySelectorAll(Menu.#selectorParentMenuHyperlinks);

    // loop Through All The Hyperlinks Of Parent Menu
    for(const a of hyperlinksParentMenu){
      // De-Activate All
      a.parentElement.removeAttribute("active");

      // Activate Menu If Href Matches
      if(a.getAttribute("href") == window.location.pathname) a.parentElement.setAttribute("active", "");

      // Else Active The First Menu Item
      else if(window.location.pathname == "/" || window.location.pathname == "" || window.location.pathname == "/home")
        document.querySelector(`${Menu.#selectorParentMenuHyperlinks}:first-child`).parentElement.setAttribute("active", "");

    }

    ///// Sub Menu
    // Hyperlinks Of Sub Menu
    const hyperlinksSubMenu = document.querySelectorAll(Menu.#selectorSubMenuHyperlinks);

    // loop Through All The Hyperlinks Of Sub Menu
    for(const a of hyperlinksSubMenu){
      // De-Activate All
      a.removeAttribute("active");

      // Activate Menu If Href Matches
      if(a.getAttribute("href") == window.location.pathname) a.setAttribute("active", "");

      // Else Active The First Menu Item
      else if(window.location.pathname == "/" || window.location.pathname == "" || window.location.pathname == "/home")
        document.querySelector(`${Menu.#selectorParentMenuHyperlinks}:first-child`).setAttribute("active", "");

    }

  }

  // On Click Menu Button Show The Menu
  static #onClickMenuButtonShow(){
    document.querySelector(Menu.#selectorMenuButton).onclick = Menu.#show;
  }

  // On Click Cover Hide
  static #onClickCoverHide(){
    document.querySelector(window.Cover.selector).addEventListener("click", Menu.#hide);
  }

  // On Click Menu Anchors Hide The Menu
  static #onClickHyperlinksHide(){
    ///// Parent Menu
    // Hyperlinks Of Parent Menu
    const hyperlinksParentMenu = document.querySelectorAll(Menu.#selectorParentMenuHyperlinks);

    // Assign Hide Method To On Click Event
    for(const hyperlink of hyperlinksParentMenu)
      hyperlink.addEventListener("click", Menu.#hide);

    ///// Sub Menu
    // Hyperlinks Of Sub Menu
    const hyperlinksSubMenu = document.querySelectorAll(Menu.#selectorSubMenuHyperlinks);

    // Assign Hide Method To On Click Event
    for(const hyperlink of hyperlinksSubMenu)
      hyperlink.addEventListener("click", Menu.#hide);
  }

  // On Click Sub Menu Trigger Icon Extend The Sub Menu
  static #showSubMenu(){
    const subMenuTogglers = document.querySelectorAll(`${Menu.selector} > main > section > section.parentMenu > x-icon[for=toggleSubMenu]`);

    for(const toggler of subMenuTogglers)
      toggler.onclick = ()=> {
        toggler.classList.toggle("open");
        toggler.parentElement.parentElement.querySelector("section.subMenu").classList.toggle("show");
      }
  }

  /////////////////// Tools
  // Show
  static #show(){
    // Check If Already Shown
    if(Menu.#shown) return;

    // Check if body > menu exists
    if(!!Menu.#elementMenu === false) return;

    Menu.#elementMenu.style.transform = "translate(0px, 0px)";
    window.Cover.show();

    Menu.#shown = true;
  }

  // Hide
  static #hide(){
    // Check If Already Hidden
    if(Menu.#shown === false) return;

    // Check If Current Mode Is "ALWAYS_OPEN" Mode
    if(Menu.currentMode === Menu.#modes.ALWAYS_OPEN) return;

    // Check if body > menu exists
    if(!!Menu.#elementMenu === false) return;

    // Remove The Styles
    Menu.#elementMenu.removeAttribute("style");

    // Hide The Cover
    window.Cover.hide();

    Menu.#shown = false;
  }

  // toggleAlwaysOpenMode
  static #toggleAlwaysOpenMode(){
    Log.info("CSS.#toggleAlwaysOpenMode()");

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
        Menu.#elementMenuHamburgerButton.style.visibility = "visible";

        // Remove Background Color Inline Rule
        Menu.#elementMenu.style.removeProperty('background-color');

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
        Menu.#elementMenuHamburgerButton.style.visibility = "hidden";

        // Change Menu Background Color To Darker Brand Hue Based Color So It Will Look Nicer On Light Mode
        Menu.#elementMenu.style.backgroundColor = `hsla(${CSS.getValue("--color-main-hue")}, 10%, 20%, 1)`;

        // Get Live Calculated Menu Width
        const menuWidth = Menu.#elementMenu.offsetWidth + "px";

        // Header, Main, Footer Minimize
        for(const element of [header, main, footer]){
          element.style.width = `calc(100% - ${menuWidth})`;
          element.style.marginLeft = menuWidth;
        }
      }
    });
  }

  // Guard
  static #menuGuard(menu){
    // Check If Menu Is Enabled
    // Done At Menu.init()

    // Check If Menu Linked Page Exists In CONF["pages"]
    if(!(menu in window.CONF["pages"])) return false;

    // Check If Menu Linked Page Is Enabled In CONF["pages"]
    if(window.CONF["pages"][menu]["enabled"] == false) return false;

    // Use Route Guard To Check Menus
    return window.Router.routeGuard(menu);
  }

  // Sub Menu HTML Builder
  static #subMenuBuilder(subMenus){
    let subMenusHtml = "";
    for(const subMenu of subMenus)
      if(Menu.#menuGuard(subMenu["page"]) === true)
        subMenusHtml += `
          <a href="${window.CONF["pages"][subMenu["page"]]["endpoints"][0]}">
            <x-icon color="#ffffff" name="${"icon" in subMenu ? subMenu["icon"] : subMenu["page"]}"></x-icon>
            ${"name" in subMenu ? window.Lang.use(subMenu["name"]) : window.Lang.use(subMenu["page"])}
          </a>
        `;

    return subMenusHtml;
  }
}

// Make Menu Usable W/O Importing It
window.Menu = Menu;
