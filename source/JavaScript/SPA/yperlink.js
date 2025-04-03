export default class Hyperlink{
	static collect(){
		// Log.info("Hyperlink.collect()");

		const links = document.getElementsByTagName("a");

		for(const a of links) a.onclick = ()=>{
			// Check if has href
			if(!!a.hasAttribute("href") === false) return;

			// Check if href is hash.
			if(a.getAttribute("href").charAt(0) === '#') return;

			// Check if href is for file or external URL
			if(a.getAttribute("href").includes('.')) return;

			// Check if target blank
			if(a.getAttribute("target") === "_blank") return;

			event.preventDefault();

			// If blank do nothing
			if(a.getAttribute('href') == '') return;

			Hyperlink.locate(a.getAttribute("href"));
		}
	}

	// locate | load | open
	// Force full page reload: No
	static locate(url = ""){
		const completed_URL = new URL(url, window.location.origin);

		// Check if current page is already equal to requesting page
		if(window.location.href == completed_URL.href) return;

		// Push new state to history
		window.history.pushState({ page: completed_URL.href }, '', completed_URL.href);

		// Firing event "URL_change" after changing the URL
		window.dispatchEvent(new CustomEvent('URL_change'));
	}

	// Unlike Hyperlink.locate, users cannot navigate back to the original page using the browser's back button.
	// Force full page reload: Yes
	static replace(url = ""){
		// Check if current page is already equal to requesting page
		if(window.location.href == url) return;

		const completed_URL = new URL(url, window.location.origin);

		window.location.replace(completed_URL);
	}
}

// Make Hyperlink Usable W/O Importing It
window.Hyperlink = Hyperlink;
