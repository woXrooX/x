"use strict";

import Cover from "./cover.js"

export default class Menu{
  static selector = "body > menu";
  static #selectorMenuButton = "body > header > svg[for=menu]";
  static #selectorHyperlinks = `${Menu.selector} > * > a`;
  static #shown = false;
  static #elementMenu = null;

  // Class Static Initialization Block
  static {
    Menu.#onClickMenuButtonShow();
    Menu.#onClickCoverHide();
    Menu.#onClickHyperlinksHide();

  }

  /////////////////// Active
  static setActive(){
    document.querySelectorAll(Menu.#selectorHyperlinks).forEach((a) => {
      a.removeAttribute("active");
      if(a.getAttribute("href") == window.location.pathname){
        a.setAttribute("active", "");
      }else if(window.location.pathname == "/"){
        document.querySelector("body > menu > * > a[href='/home']").setAttribute("active", "");
      }
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


  static #exists(){
    Menu.#elementMenu = document.querySelector(Menu.selector);
    return !!Menu.#elementMenu;

  }

  /////////////////// Show
  static #show(){
    // Check If Already Shown
    if(Menu.#shown) return;

    // Check if body > menu exists
    if(Menu.#exists() === false) return;

    Menu.#elementMenu.style.transform = "translate(0px, 0px)";
    Cover.show();

    Menu.#shown = true;

  }

  /////////////////// Hide
  static #hide(){
    // Check If Already Hidden
    if(!Menu.#shown) return;

    // Check if body > menu exists
    if(Menu.#exists() === false) return;

    Menu.#elementMenu.removeAttribute("style");
    Cover.hide();

    Menu.#shown = false;

  }


  //
  // /////////////////// close MENU, CART, COVER On URL Change
  // window.addEventListener('locationchange', ()=>{
  //   closeMenuCartCover();
  // });
}
