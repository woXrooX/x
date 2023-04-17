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
    Cover.#elementCover.style.zIndex = window.CSS.values.zIndex.cover;

    // disable scrolling
    document.body.style = "overflow: hidden";

  }

  static hide(){
    // Check if body > cover exists
    if(!!Cover.#elementCover === false) return;

    Cover.#elementCover.style.opacity = 0;
    setTimeout(()=>{
      Cover.#elementCover.style.zIndex = window.CSS.values.zIndex.minus;
    }, parseInt(window.CSS.values.transition.velocity));

    // enable scrolling
    document.body.removeAttribute("style");

  }

  static onClickExecute(func){
    // Execute External Function
    document.querySelector(Cover.selector).addEventListener("click", func);

  }

}

// Make Cover Usable W/O Importing It
window.Cover = Cover;
