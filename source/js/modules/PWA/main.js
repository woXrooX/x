if("serviceWorker" in navigator){
	navigator.serviceWorker.register("/js/modules/PWA/main.js")
		.then(registration =>{})
		.catch(error => {})
	;
}
