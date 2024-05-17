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

		Loading.#elementLoading.classList.remove("loaded");
	}

	static end(){
		// Check if body > loading exists
		if(!!Loading.#elementLoading === false) return;

		Loading.#elementLoading.classList.add("loaded");
	}

	static on_element(element){
		if(!!element === false) return;
		element.classList.toggle('loading-on-element');
	}
};

window.Loading = Loading;
