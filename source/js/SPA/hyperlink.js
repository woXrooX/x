"use strict";

export default class Hyperlink{
	static collect(){
		// Log.info("Hyperlink.collect()");

		const links = document.getElementsByTagName("a");

		for(const a of links){
			a.onclick = ()=>{
				// Check iF has href
				if(!!a.hasAttribute("href") === false) return;

				// Check iF href is hash.
				if(a.getAttribute("href").charAt(0) == '#') return;

				// Check if href is for file or external URL
				if(a.getAttribute("href").includes('.')) return;

				event.preventDefault();

				// If blank do nothing
				if(a.getAttribute('href') == '') return;

				Hyperlink.locate(a.getAttribute("href"));
			}
		}
	}

	// locate | load | open
	// Force full page reload: No
	static locate(url = ""){
		// Check if current page is already equal to requesting page
		if(window.location.href == url) return;

		const completed_url = new URL(url, window.location.origin);

		// Add To History
		window.history.pushState("", "", completed_url);

		// Firing Event "locationchange" After Changing URL
		window.dispatchEvent(new Event('locationchange'));
	}

	// Unlike Hyperlink.locate, users cannot navigate back to the original page using the browser's back button.
	// Force full page reload: Yes
	static replace(url = ""){
		// Check if current page is already equal to requesting page
		if(window.location.href == url) return;

		const completed_url = new URL(url, window.location.origin);

		window.location.replace(completed_url);
	}
}

// Make Hyperlink Usable W/O Importing It
window.Hyperlink = Hyperlink;
