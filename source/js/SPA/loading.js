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

		Loading.#elementLoading.style.zIndex = window.CSS.getValue("--z-loading");
		Loading.#elementLoading.style.opacity = 1;
	}

	static end(){
		// Check if body > loading exists
		if(!!Loading.#elementLoading === false) return;

		Loading.#elementLoading.style.opacity = 0;

		// Wait for the duration of --transition-velocity
		setTimeout(()=>{
			Loading.#elementLoading.style.zIndex = window.CSS.getValue("--z-minus");
		}, parseInt(getComputedStyle(document.body).getPropertyValue('--transition-velocity')));
	}
};

window.Loading = Loading;
