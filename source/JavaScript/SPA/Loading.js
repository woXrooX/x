export default class Loading{
	static selector = "body > loading";
	static #element_loading = null;

	static {
		Loading.#element_loading = document.querySelector(Loading.selector);
	}

	static start(){
		// Check if body > loading exists
		if (!!Loading.#element_loading === false) return;

		Loading.#element_loading.classList.remove("loaded");
	}

	static end(){
		// Check if body > loading exists
		if (!!Loading.#element_loading === false) return;

		Loading.#element_loading.classList.add("loaded");
	}


	static on_element_toggle(element){
		if (!!element === false) return;
		element.classList.toggle('loading-on-element');
	}

	static on_element_start(element, use_BG_unset = false) {
		if (!!element === false) return;

		element.classList.add('loading-on-element');

		if (use_BG_unset === true) element.classList.add('loading-on-element-bg-unset');
	}

	static on_element_end(element) {
		if (!!element === false) return;

		element.classList.remove('loading-on-element');
		element.classList.remove('loading-on-element-bg-unset');
	}
};

window.Loading = Loading;
