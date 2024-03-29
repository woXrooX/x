"use strict";

///////////////////////////// FETCH - Bridge
export default async function bridge(url='', data=null, contentType = null, method="POST"){
	// Set the default URL
	if(!!url === false) url = window.location.href;

	// Default Content Type Is "application/json"
	if(!!contentType === false) contentType = "application/json";

	const completed_url = new URL(url, window.location.origin);

	window.Log.info(`bridge request to: ${completed_url.href}`);

	try{
		const response = await fetch(completed_url, {
			method: method,
			mode: 'same-origin',
			cache: 'force-cache',
			credentials: 'include',

			// Check If contentType == "application/json"
			...(contentType == "application/json") && {headers: {"Content-Type": "application/json"}},

			redirect: 'follow',
			referrerPolicy: 'no-referrer',

			// Check If contentType == "application/json" Then Pass JSON.stringify(data) Else Just Data
			body: (contentType == "application/json") ? JSON.stringify(data) : data
		});

		if(response.ok) return await response.json();
		else{
			console.warn(`[Bridge] Response Error:\n\t- Status Code: ${response.status}\n\t- Status Text: ${response.statusText}\n\t- URL: ${response.url}`);
			return {"type": "error", "message": response.statusText}
		}

	}catch(error){
		console.warn("[Bridge] "+error);
		return {"type": "error", "message": error}
	}
}

// Make bridge() Usable W/O Importing It
window.bridge = bridge;
