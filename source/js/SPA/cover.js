"use strict";

export default class Cover{
  static selector = "body > cover";
  static #elementCover = null;

  static{
    Cover.#elementCover = document.querySelector(Cover.selector);

  }

  static show(){
    // Check if body > cover exists
    if(!!Cover.#elementCover === false) return;

    Cover.#elementCover.style.opacity = 1;
    Cover.#elementCover.style.zIndex = getComputedStyle(document.body).getPropertyValue('--z-cover');

    // disable scrolling
    document.body.style = "overflow: hidden";

  }

  static hide(){
    // Check if body > cover exists
    if(!!Cover.#elementCover === false) return;

    Cover.#elementCover.style.opacity = 0;
    setTimeout(()=>{
      Cover.#elementCover.style.zIndex = getComputedStyle(document.body).getPropertyValue('--z-minus');
    }, parseInt(getComputedStyle(document.body).getPropertyValue('--transition-velocity')));

    // enable scrolling
    document.body.removeAttribute("style");

  }

}
