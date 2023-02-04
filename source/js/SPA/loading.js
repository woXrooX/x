"use strict";

export default class Loading{
  static selector = "body > loading";
  static #elementLoading = null;

  static #exists(){
    Loading.#elementLoading = document.querySelector(Loading.selector);
    return !!Loading.#elementLoading;

  }

  static done(){
    // Check if body > loading exists
    if(Loading.#exists() === false) return;

    Loading.#elementLoading.style.opacity = 0;
    setTimeout(()=>{
      Loading.#elementLoading.style.zIndex = getComputedStyle(document.body).getPropertyValue('--z-minus');
    }, parseInt(getComputedStyle(document.body).getPropertyValue('--transition-velocity')));

  }
};
