export default class Cover{
	static selector = "body > cover";
	static #element = null;

	static {
		Cover.#element = document.querySelector(Cover.selector);
	}

	// Can be set the cover z-index if needed
	static show(z_index = x.CSS.get_value("--z-cover")){
		// Check if body > cover exists
		if(!!Cover.#element === false) return;

		// If "auto" was passed set to default z_index
		if(z_index === "auto") z_index = x.CSS.get_value("--z-cover");

		Cover.#element.style.opacity = 1;
		Cover.#element.style.zIndex = z_index;

		window.x.Body.lock_scroll_y_axis();
	}

	static hide(){
		// Check if body > cover exists
		if(!!Cover.#element === false) return;

		Cover.#element.style.opacity = 0;

		Cover.#element.ontransitionend = ()=>{
			Cover.#element.style.zIndex = x.CSS.get_value("--z-minus");
			Cover.#element.ontransitionend = null;
		};

		window.x.Body.unlock_scroll_y_axis();
	}

	static on_click_execute(func){
		// Execute External Function
		Cover.#element.addEventListener("click", func);
	}
}

// Make Cover Usable W/O Importing It
window.Cover = Cover;
