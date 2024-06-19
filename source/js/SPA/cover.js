"use strict";

export default class Cover{
	static selector = "body > cover";
	static #element = null;

	static {
		Cover.#element = document.querySelector(Cover.selector);
	}

	// Can be set the cover z-index if needed
	static show(zIndex = x.CSS.getValue("--z-cover")){
		// Check if body > cover exists
		if(!!Cover.#element === false) return;

		// If "auto" was passed set to default zIndex
		if(zIndex === "auto") zIndex = x.CSS.getValue("--z-cover");

		Cover.#element.style.opacity = 1;
		Cover.#element.style.zIndex = zIndex;

		// disable scrolling
		document.body.style = "overflow: hidden";
	}

	static hide(){
		// Check if body > cover exists
		if(!!Cover.#element === false) return;

		Cover.#element.style.opacity = 0;

		Cover.#element.ontransitionend = ()=>{
			Cover.#element.style.zIndex = x.CSS.getValue("--z-minus");
			Cover.#element.ontransitionend = null;
		};

		// enable scrolling
		document.body.removeAttribute("style");
	}

	static onClickExecute(func){
		// Execute External Function
		Cover.#element.addEventListener("click", func);
	}
}

// Make Cover Usable W/O Importing It
window.Cover = Cover;
