"use strict";

export default class Loading{
  static selector = "body > loading";
  static #elementLoading = null;

  static {
    Loading.#elementLoading = document.querySelector(Loading.selector);

  }

  static start(){
    // Check if body > loading exists
    if(!!Loading.#elementLoading === false) return;
    // console.log("start");

    // Set z-index To loading
    Loading.#elementLoading.style.zIndex = window.CSS.values.zIndex.loading;

    // Change The Opacity To 1
    Loading.#elementLoading.style.opacity = 1;

  }

  static end(){
    // Check if body > loading exists
    if(!!Loading.#elementLoading === false) return;
    // console.log("end");

    // Change The Opacity To 0
    Loading.#elementLoading.style.opacity = 0;

    // Wait For The Duration Of --transition-velocity
    setTimeout(()=>{
      // Set z-index To minus
      Loading.#elementLoading.style.zIndex = window.CSS.values.zIndex.minus;

    }, parseInt(getComputedStyle(document.body).getPropertyValue('--transition-velocity')));

  }
};

// Make Loading Usable W/O Importing It
window.Loading = Loading;
