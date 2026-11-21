export default class Cover {
	/////////////////////////// Static

	/////////// Variables

	static selector = "body > cover";

	static #element = null;


	//// Static initialization blocks

	static {
		Cover.#element = document.querySelector(Cover.selector);
	}


	/////////// APIs

	// Can be set the cover z-index if needed
	static show(z_index = x.CSS.get_value("--z-cover")) {
		// Check if body > cover exists
		if (!!Cover.#element === false) return;

		// If "auto" was passed set to default z_index
		if (z_index === "auto") z_index = x.CSS.get_value("--z-cover");

		Cover.#element.style.zIndex = z_index;
		Cover.#element.classList.add("show");

		window.x.Body.lock_scroll_y_axis();
	}

	// z-index is left alone: CSS keeps the cover visible and clickable until the fade-out ends (see body > cover in master.css)
	static hide() {
		// Check if body > cover exists
		if (!!Cover.#element === false) return;

		Cover.#element.classList.remove("show");

		window.x.Body.unlock_scroll_y_axis();
	}

	static on_click_execute(func) {
		// Execute External Function
		Cover.#element.addEventListener("click", func);
	}
}

window.x["Cover"] = Cover;
