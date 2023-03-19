"use strict";

export default class Menu{
  static selector = "body > menu";
  static #selectorMenuButton = "body > header > svg[for=menu]";
  static #selectorHyperlinks = `${Menu.selector} > * > a`;
  static #shown = false;
  static #elementMenu = null;

  // Init
  static init(){
    Menu.#elementMenu = document.querySelector(Menu.selector);

    // Check If "body > menu" Exists
    if(!!Menu.#elementMenu === false) return;

    // Try To Build The Menu
    if(Menu.build() === false) return;

    // Listen To The Events
    Menu.#onClickMenuButtonShow();
    Menu.#onClickCoverHide();

  }

  /////////////////// Create Menu | Re-Build
  static build(){
    // console.log("Menu.build()");

    // Check If CONF Has Menu
    if(!("menu" in window.CONF)) return false;

    // Check If Menu Is Enabled
    if(window.CONF["menu"]["enabled"] === false) return false;


    let hyperlinks = "";

    for(const menu of window.CONF["menu"]["menus"])
      if(Menu.#menuGuard(menu["name"]) === true)

        // Hyperlink Blue Print
        hyperlinks += `
  <a href="/${menu["name"]}">
    <svg><use href="#${"logo" in menu ? menu["logo"] : menu["name"] }"></use></svg>
    ${window.Lang.use(menu["name"])}
  </a>
        `;


    // Add Hyperlinks Into Menu > Main
    Menu.#elementMenu.querySelector("main").innerHTML = hyperlinks;

    // After Adding Hyperlinks To Dom Create Hide Event For Each Of The Hyperlinks
    Menu.#onClickHyperlinksHide();

  }

  /////////////////// Active
  static setActive(){
    document.querySelectorAll(Menu.#selectorHyperlinks).forEach((a) => {
      a.removeAttribute("active");

      if(a.getAttribute("href") == window.location.pathname) a.setAttribute("active", "");
      else if(window.location.pathname == "/") document.querySelector("body > menu > * > a[href='/home']").setAttribute("active", "");

    });
  }

  /////////////////// On Click Menu Button Show The Menu
  static #onClickMenuButtonShow(){
    document.querySelector(Menu.#selectorMenuButton).onclick = Menu.#show;
  }

  /////////////////// On Click Cover Hide The Menu
  static #onClickCoverHide(){
    document.querySelector(window.Cover.selector).addEventListener("click", Menu.#hide);
  }

  /////////////////// On Click Menu Anchors Hide The Menu
  static #onClickHyperlinksHide(){
    document.querySelectorAll(Menu.#selectorHyperlinks).forEach((a) => {
      a.addEventListener("click", Menu.#hide);
    });
  }


  /////////////////// Show
  static #show(){
    // Check If Already Shown
    if(Menu.#shown) return;

    // Check if body > menu exists
    if(!!Menu.#elementMenu === false) return;

    Menu.#elementMenu.style.transform = "translate(0px, 0px)";
    window.Cover.show();

    Menu.#shown = true;

  }

  /////////////////// Hide
  static #hide(){
    // Check If Already Hidden
    if(!Menu.#shown) return;

    // Check if body > menu exists
    if(!!Menu.#elementMenu === false) return;

    Menu.#elementMenu.removeAttribute("style");
    window.Cover.hide();

    Menu.#shown = false;

  }


  /////////////////// Guard
  static #menuGuard(menu){
    // Check If Menu Is Enabled
    // Done At Menu.init()


    // Check If Menu Exists (Depreciated)
    // Already Looping Through Existent Menus


    // Check If Current Menu Is Enabled (Depreciated)
    // If Menu In List Means Already Enabled
    // if(window.CONF["menu"]["menus"][menu]["enabled"] === false) return false;


    // Check If Menu Linked Page Exists In CONF["pages"]
    if(!(menu in window.CONF["pages"])) return false;


    // Check If Menu Linked Page Is Enabled In CONF["pages"]
    if(window.CONF["pages"][menu]["enabled"] == false) return false;


    // Everyone
    if(window.CONF["pages"][menu]["allowed"].includes("everyone")) return true;


    // Session Dependent Checks
    if("user" in window.session){
      // Root
      if(window.session["user"]["type"] == window.USER_TYPES["root"]["id"]) return true;

      // If User Type Matches With One Of The Page's Allowed User Types
      for(let user_type in window.USER_TYPES)
        if(
          window.session["user"]["type"] == window.USER_TYPES[user_type]["id"] &&
          window.CONF["pages"][menu]["allowed"].includes(user_type)
        )
          return true;

    }


    // Session Independent Checks
    if(!("user" in window.session)){
      // Unauthenticated User
      if(window.CONF["pages"][menu]["allowed"].includes("unauthenticated")) return true;

    }


    // Failed The Guard Checks
    return false;

  }

}

// Make Menu Usable W/O Importing It
window.Menu = Menu;
