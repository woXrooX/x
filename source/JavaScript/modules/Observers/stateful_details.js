export function stateful_details() {
	const param_name = "x_details_id";
	const details_list = Array.from(document.querySelectorAll("div#root > main details"));

	// Wire up toggle events with deterministic IDs
	for (let i = 0; i < details_list.length; i++) {
		const details = details_list[i];

		if (!details.id) details.id = i;

		details.addEventListener('toggle', () => {
			if (details.open) set_param_id(details.id);
			else if (get_param_id() === details.id) set_param_id(null);
		});
	}

	// Restore state from URL on load
	const open_id = get_param_id();
	if (open_id) {
		const details = document.getElementById(open_id);
		if (details) details.open = true;
	}

	function get_param_id() {
		const url = new URL(location.href);
		return url.searchParams.get(param_name);
	}

	function set_param_id(id) {
		const url = new URL(location.href);
		if (id) url.searchParams.set(param_name, id);
		else url.searchParams.delete(param_name);
		history.replaceState(null, '', url);
	}
}
