"use strict";

export default class Cover{
  static selector = "body > cover";
  static #elementCover = null;

  static{
    Cover.#elementCover = document.querySelector(Cover.selector);
  }

  // Can be set the cover z-index if needed
  static show(zIndex = window.CSS.getValue("--z-cover")){
    // Check if body > cover exists
    if(!!Cover.#elementCover === false) return;

    // If "auto" was passed set to default zIndex
    if(zIndex === "auto") zIndex = window.CSS.getValue("--z-cover");

    Cover.#elementCover.style.opacity = 1;
    Cover.#elementCover.style.zIndex = zIndex;

    // disable scrolling
    document.body.style = "overflow: hidden";
  }

  static hide(){
    // Check if body > cover exists
    if(!!Cover.#elementCover === false) return;

    Cover.#elementCover.style.opacity = 0;

    setTimeout(()=>{
      Cover.#elementCover.style.zIndex = window.CSS.getValue("--z-minus");
    }, parseInt(window.CSS.getValue("--transition-velocity")));

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
