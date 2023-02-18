"use strict";

import {elementExists} from "../modules/tools.js"
import Cover from "./cover.js"

export default class Menu{
  static selector = "body > menu";
  static #selectorMenuButton = "body > header > svg[for=menu]";
  static #selectorHyperlinks = `${Menu.selector} > * > a`;
  static #shown = false;
  static #elementMenu = null;

  // Class Static Initialization Block
  static init(){
    Menu.#elementMenu = document.querySelector(Menu.selector);

    // Check If CONF Has Menu
    if(!("menu" in window.CONF)) return;

    // Check If Menu Is Enabled
    if(window.CONF["menu"]["enabled"] === false) return;

    // Check If Menu Exists
    if(!!Menu.#elementMenu === false) return;


    // Events Listen To The Events
    Menu.build();

    Menu.#onClickMenuButtonShow();
    Menu.#onClickCoverHide();

  }

  /////////////////// Create Menu | Re-Build
  static build(){
    // console.log("Menu.build()");

    let hyperlinks = "";

    for(const menu in window.CONF["menu"]["menus"]){

      if(Menu.#menuGuard(menu) === true)

      // Hyperlink Blue Print
      hyperlinks += `
<a href="/${menu}">
  <svg><use href="#${menu}"></use></svg>
  ${window.langDict[menu][window.langCode]}
</a>
      `;

    }

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

  /////////////////// On Click Menu Button Show
  static #onClickMenuButtonShow(){
    document.querySelector(Menu.#selectorMenuButton).onclick = Menu.#show;
  }

  /////////////////// On Click Cover Hide
  static #onClickCoverHide(){
    document.querySelector(Cover.selector).addEventListener("click", Menu.#hide);
  }

  /////////////////// On Click Menu Anchors Hide
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
    Cover.show();

    Menu.#shown = true;

  }

  /////////////////// Hide
  static #hide(){
    // Check If Already Hidden
    if(!Menu.#shown) return;

    // Check if body > menu exists
    if(!!Menu.#elementMenu === false) return;

    Menu.#elementMenu.removeAttribute("style");
    Cover.hide();

    Menu.#shown = false;

  }


  /////////////////// Guard
  static #menuGuard(menu){
    // Check If Current Menu Is Enabled
    if(window.CONF["menu"]["menus"][menu]["enabled"] === false) return false;

    // Looping Through Current Menu's Allowance List
    for(const allowed of window.CONF["menu"]["menus"][menu]["allowed"]){
      // Only Allowed "unauthenticated" Users
      if(allowed == "unauthenticated" && "user" in window.session) return false;

      // Only Allowed "unauthorized" Users
      if(allowed == "unauthorized" && !("user" in window.session)) return false;

      // Only Allowed "authorized" Users
      // Retrive authorized_type_id From Database
      // const authorized_type_id = 5
      // if(allowed == "authorized")
      //   if(!("user" in window.session) || ("user" in window.session && window.session["user"]["type"] != authorized_type_id))
      //     return false;

    }

    // Passed The Guard Checks
    return true;

  }

}
