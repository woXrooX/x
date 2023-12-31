"use strict";

export default class Hyperlink{
	static collect(){
		const links = document.getElementsByTagName("a");

		for(const a of links){
			a.onclick = ()=>{
				// Check IF Has Href
				if(!!a.hasAttribute("href") === false) return;

				// Check IF Href Is Hash.
				if(a.getAttribute("href").charAt(0) == '#') return;

				// Check IF Href Is for File.
				// For Now Bulk Checking Using '.'
				if(a.getAttribute("href").includes('.')) return;

				// Check If Href Is For External Webistes
				// Previous Check Is Already Doing This Job By Checking If Href Has '.' example.com always Has '.'
				if(a.getAttribute("href").includes('http://') || a.getAttribute("href").includes('https://')) return;

				event.preventDefault();

				Hyperlink.locate(a.getAttribute("href"));
			}
		}
	}

	// locate | load | open
	// Force full page reload: No
	static locate(path = "", raw = false){
		// Check if current page is already equal to requesting page
		if(window.location.href == path) return;

		const URL = raw === false ? `${window.location.origin}${path}` : path;

		// Add To History
		window.history.pushState("", "", URL);

		// Firing Event "locationchange" After Changing URL
		window.dispatchEvent(new Event('locationchange'));
	}

	// Like Hyperlink.locate, users cannot navigate back to the original page using the browser's back button.
	// Force full page reload: Yes
	static replace(path = "", raw = false){
		// Check if current page is already equal to requesting page
		if(window.location.href == path) return;

		const URL = raw === false ? `${window.location.origin}${path}` : path;

		window.location.replace(URL);
	}
}

// Make Hyperlink Usable W/O Importing It
window.Hyperlink = Hyperlink;
