import "/JavaScript/Globals.js";
import Core from "/JavaScript/SPA/Core.js";



//// SW: Service worker: registered after the page has loaded

if ("serviceWorker" in navigator)
	window.addEventListener("load", register_service_worker);

function register_service_worker() {
	navigator.serviceWorker.register("/SW.js").catch(function(error) {
		console.error("Main: Service worker registration failed", error);
	});
}



//// Core

try {
	await x.Core.init();
}

catch (error) {
	console.error("Main: Failed x.Core.init()", error);
}
