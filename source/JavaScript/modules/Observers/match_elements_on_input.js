/////////////////////////// match_elements_on_input

//// Sample: match_handler_callback
// function match_handler_callback(search_input_value, element) {
// 	if (element.innerText.toLowerCase().includes(search_input_value.toLowerCase())) {
// 		element.style.display = "flex";
// 		return true;
// 	}

// 	else {
// 		element.style.display = "none";
// 		return false;
// 	}
// }

//// Sample: no_match_callback
// function no_match_callback(has_matches) {
// 	const container_element = document.querySelector("container.no_match");

// 	if (has_matches === true) container_element.innerHTML = '';
// 	else container_element.innerHTML = `<p class="surface-info width-100 padding-2">No match</p>`;
// }

export function match_elements_on_input(
	input_element_or_selector,
	matchable_elements_or_selector,
	match_handler_callback,
	no_match_callback = null,
) {
	const input_element = validate_input_element();
	if (input_element === false) return;
	input_element.focus();

	const matchable_elements = normalize_matchable_elements();
	if (matchable_elements.length === 0) return;

	let debounce_timeout;

	input_element.addEventListener("input", ()=>{
		clearTimeout(debounce_timeout);

		debounce_timeout = setTimeout(()=>{
			let has_matches = false;

			for (const matchable_element of matchable_elements) {
				const matched = match_handler_callback(input_element.value, matchable_element);
				if (has_matches === false) has_matches = matched;
			}

			if (typeof(no_match_callback) === "function") no_match_callback(has_matches);
		}, 300);
	});


	/////////// Helpers

	function validate_input_element() {
		if (!input_element_or_selector) return false;
		if (typeof(input_element_or_selector) === "string") return document.querySelector(input_element_or_selector);
		if (input_element_or_selector instanceof Element) return input_element_or_selector;

		return false;
	}

	function normalize_matchable_elements() {
		if (!matchable_elements_or_selector) return [];

		// Single element
		if (matchable_elements_or_selector instanceof Element) return [matchable_elements_or_selector];

		// Selector
		if (typeof(matchable_elements_or_selector) === "string") {
			try { return Array.from(document.querySelectorAll(matchable_elements_or_selector)); }

			// Invalid selector
			catch { return []; }
		}

		// Iterables (NodeList, HTMLCollection (modern), Array, Set, etc.)
		if (typeof(matchable_elements_or_selector?.[Symbol.iterator]) === "function") {
			const elements = [];
			for (const element of matchable_elements_or_selector) if (element instanceof Element) elements.push(element);
			return elements;
		}

		return [];
	}
}

