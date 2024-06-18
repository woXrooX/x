if("serviceWorker" in navigator)
	navigator.serviceWorker.register("/js/modules/PWA/SW.js")
		.then(registration => {console.log("Service worker registration succeeded:", registration);})
		.catch(error => {console.error(`Service worker registration failed: ${error}`);})
	;
else console.error("Service workers are not supported.");

