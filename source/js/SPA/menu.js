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

    // Check If Menu Exists Then Listen To The Events
    if(!!Menu.#elementMenu !== false){
      Menu.#build();

      Menu.#onClickMenuButtonShow();
      Menu.#onClickCoverHide();
      Menu.#onClickHyperlinksHide();

    }

  }

  /////////////////// Create Menu | Re-Build
  static #build(){
    // Check If Menu Exists
    if(!!Menu.#elementMenu === false) return;

    // Check If Menu Feature Enabled
    if(window.conf["features"]["menu"]["status"] === false) return;

    // Build Menus
    let hyperlinks = "";
    window.conf["features"]["menu"]["menus"].forEach((menu) => {
      hyperlinks += `
<a href="/${menu.name}">
  <svg><use href="#${menu.svg}"></use></svg>
  ${window.langDict[menu.name][window.langCode]}
</a>
      `;
    });

    // Add Hyperlinks Into Menu > Main
    Menu.#elementMenu.querySelector("main").innerHTML = hyperlinks;

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

}
