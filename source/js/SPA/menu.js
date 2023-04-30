"use strict";

export default class Menu{
  static selector = "body > menu";
  static #selectorMenuButton = "body > header > x-icon[for=menu]";
  static #selectorHyperlinks = `${Menu.selector} > * > a`;

  static #elementMenuHamburgerButton = null;
  static #elementMenu = null;

  static #shown = false;

  static #modes = ["normal", "alwaysOpen", "onlyLogos"];
  static #currentMode = null;


  /////////////////// Init
  static init(){
    Menu.#elementMenuHamburgerButton = document.querySelector(Menu.#selectorMenuButton);
    Menu.#elementMenu = document.querySelector(Menu.selector);

    // Check If "body > menu" Exists
    if(!!Menu.#elementMenu === false) return;

    // Try To Build The Menu
    if(Menu.build() === false) return;

    // Listen To The Events
    Menu.#onClickMenuButtonShow();
    Menu.#onClickCoverHide();
    Menu.#toggleAlwaysOpenMode();
    Menu.#colorModeSwitcher();

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
  <a href="${window.CONF["pages"][menu["name"]]["endpoints"][0]}">
    <x-icon color="#ffffff">${"logo" in menu ? menu["logo"] : menu["name"]}</x-icon>
    ${window.Lang.use(menu["name"])}
  </a>
        `;


    // Add Hyperlinks Into Menu > Main
    Menu.#elementMenu.querySelector("main").innerHTML = hyperlinks;

    // After Adding Hyperlinks To Dom Create Hide Event For Each Of The Hyperlinks
    Menu.#onClickHyperlinksHide();

  }

  /////////////////// On Click Events
  // Active
  static setActive(){
    document.querySelectorAll(Menu.#selectorHyperlinks).forEach((a) => {
      a.removeAttribute("active");

      if(a.getAttribute("href") == window.location.pathname) a.setAttribute("active", "");
      else if(window.location.pathname == "/" || window.location.pathname == "" || window.location.pathname == "/home")
        document.querySelector("body > menu > * > a:first-child").setAttribute("active", "");

    });
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
    document.querySelectorAll(Menu.#selectorHyperlinks).forEach((a) => {
      a.addEventListener("click", Menu.#hide);
    });
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
    if(!Menu.#shown) return;

    // Check If Current Mode Is "alwaysOpen" Mode
    if(Menu.#currentMode === 1) return;

    // Check if body > menu exists
    if(!!Menu.#elementMenu === false) return;

    Menu.#elementMenu.removeAttribute("style");
    window.Cover.hide();

    Menu.#shown = false;

  }

  // toggleAlwaysOpenMode
  static #toggleAlwaysOpenMode(){
    const toggler = document.querySelector(`${Menu.selector} > header > div[for=toggleAlwaysOpenMode]`);

    const header = document.querySelector(window.Header.selector);
    const main = document.querySelector(window.Main.selector);
    const footer = document.querySelector(window.Footer.selector);

    toggler.addEventListener("click", ()=>{

      if(Menu.#currentMode === 1){
        // Mode Change To "normal"
        Menu.#currentMode = 0;

        window.Cover.show();

        // Show Hamburger Button
        Menu.#elementMenuHamburgerButton.style.visibility = "visible";

        // Change The Lock Logo To Open
        toggler.innerHTML = "<x-icon color='#ffffff'>lockOpen</x-icon>";

        // Header, Main, Footer Maximize
        header.removeAttribute("style");
        main.removeAttribute("style");
        footer.removeAttribute("style");

      }else{
        // Mode Change To "alwaysOpen"
        Menu.#currentMode = 1;

        window.Cover.hide();

        // Hide Hamburger Button
        Menu.#elementMenuHamburgerButton.style.visibility = "hidden";

        // Change The Lock Logo To Locked
        toggler.innerHTML = "<x-icon color='#ffffff'>lockLocked</x-icon>";

        // Get Calculated Meni Width
        const menuWidth = Menu.#elementMenu.offsetWidth + "px";

        // Header, Main, Footer Minimize
        for(const element of [header, main, footer]){
          element.style.width = `calc(100% - ${menuWidth})`;
          element.style.marginLeft = menuWidth;
        }

      }

    });

  }

  static #colorModeSwitcher(){
    const switcher = document.querySelector(`${Menu.selector} > header > div[for=colorModeSwitcher]`);

    switcher.addEventListener("click", ()=>{
      // Dark Mode
      if(window.CSS.currentColorMode === window.CSS.colorModes.LIGHT){
        switcher.innerHTML = "<x-icon color='#ffffff'>light_mode</x-icon>";
        window.CSS.currentColorMode = window.CSS.colorModes.DARK;
      }
      // Light Mode
      else{
        switcher.innerHTML = "<x-icon color='#ffffff'>dark_mode</x-icon>";
        window.CSS.currentColorMode = window.CSS.colorModes.LIGHT;
      }

      window.CSS.colorModeSwitcher();

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

}

// Make Menu Usable W/O Importing It
window.Menu = Menu;
