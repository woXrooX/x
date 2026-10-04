import "/JavaScript/Globals.js";
import Core from "/JavaScript/SPA/Core.js";


//// SW: Service worker

// Register the service worker and reload the page when a new version takes control
(function register_service_worker() {
	if (!("serviceWorker" in navigator)) return;

	let had_controller = navigator.serviceWorker.controller !== null;
	let refreshing = false;

	navigator.serviceWorker.addEventListener("controllerchange", ()=>{
		Log.important("Main.js->register_service_worker(): controllerchange");

		// On a first visit the initial claim is not an update, so only reload when an existing controller was replaced
		if (had_controller && !refreshing) {
			refreshing = true;
			location.reload();
		}

		had_controller = true;
	});

	navigator.serviceWorker.register("/SW.js");
})();



//// Core

try {
	await x.Core.init();
}

catch (error) {
	console.error("Main: Failed x.Core.init()", error);
}
