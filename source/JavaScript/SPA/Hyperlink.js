export default class Hyperlink{
	static collect() {
		// Log.info("Hyperlink.collect()");

		const links = document.getElementsByTagName("a");

		for(const a of links) a.onclick = ()=>{
			// Check if has href
			if (!!a.hasAttribute("href") === false) return;

			// Check if href is hash.
			if (a.getAttribute("href").charAt(0) === '#') return;

			// Check if href is for file or external URL
			if (a.getAttribute("href").includes('.')) return;

			// Check if target blank
			if (a.getAttribute("target") === "_blank") return;

			event.preventDefault();

			// If blank do nothing
			if (a.getAttribute('href') == '') return;

			Hyperlink.locate(a.getAttribute("href"));
		}
	}

	// locate | load | open
	// Force full page reload: No
	static locate(url = '') {
		const completed_URL = new URL(url, window.location.origin);

		// Check if current page is already equal to requesting page
		if (window.location.href == completed_URL.href) return;

		// Push new state to history
		window.history.pushState({ page: completed_URL.href }, '', completed_URL.href);

		// Firing event "URL_change" after changing the URL
		window.dispatchEvent(new CustomEvent('URL_change'));
	}

	// Unlike Hyperlink.locate, users cannot navigate back to the original page using the browser's back button.
	// Force full page reload: Yes
	static replace(url = '') {
		// Check if current page is already equal to requesting page
		if (window.location.href == url) return;

		const completed_URL = new URL(url, window.location.origin);

		window.location.replace(completed_URL);
	}

	static open_URL_in_new_tab(url) {
		const completed_URL = new URL(url, window.location.origin);
		window.open(completed_URL, '_blank', 'noopener,noreferrer');
	}

	static go_to_history(target) {
		if (!target) return false;

		//// Use modern window.navigation
		if (window.navigation)
			switch (target) {
				case "back":
					if (!window.navigation.canGoBack) return false;
					window.navigation.back();
					return true;

				case "forth":
					if (!window.navigation.canGoForward) return false;
					window.navigation.forward();
					return true;

				default: {
					const steps = parseInt(target, 10);
					if (isNaN(steps)) return false;

					const entries = window.navigation.entries();
					const target_index = window.navigation.currentEntry.index + steps;
					if (target_index < 0 || target_index >= entries.length) return false;

					window.navigation.traverseTo(entries[target_index].key);
					return true;
				}
			}


		//// Fallback to classic window.history

		if (window.history.length <= 1) return false;

		switch (target) {
			case "back":
				window.history.back();
				return true;

			case "forth":
				window.history.forward();
				return true;

			default: {
				const steps = parseInt(target, 10);
				if (isNaN(steps)) return false;

				window.history.go(steps);
				return true;
			}
		}
	}
}

window.Hyperlink = Hyperlink;
