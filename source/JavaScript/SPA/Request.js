///////////////////////////// FETCH - Bridge


export default class Request {
	static async make(
		data = null,
		url = null,
		content_type = "application/json",
		method = "POST",
		cache = "no-cache",
		headers = {}
	) {
		if (!!data === false) return {"type": "error", "message": "invalid_value"};


		// Set the default URL
		if (!!url === false) url = window.location.href;
		const completed_URL = new URL(url, window.location.origin);


		const CSRF_meta_element = document.querySelector('meta[name="x-CSRF-token"]');
		if (CSRF_meta_element) headers["x-CSRF-token"] = CSRF_meta_element.getAttribute("content");


		let payload;

		if (content_type === "application/json") {
			headers["Content-Type"] = "application/json";
			payload = JSON.stringify(data);
		}

		else if (content_type === "multipart/form-data") {
			// Let browser set Content-Type with boundary for FormData
			payload = data;
		}

		else if (content_type === "application/x-www-form-urlencoded") {
			headers["Content-Type"] = "application/x-www-form-urlencoded";
			payload = new URLSearchParams(data).toString();
		}

		else {
			headers["Content-Type"] = content_type;
			payload = data;
		}


		try {
			const response = await fetch(completed_URL, {
				method: method,
				mode: "same-origin",
				cache: cache,
				credentials: "include",
				headers: headers,
				redirect: "follow",
				referrerPolicy: "no-referrer",
				body: payload
			});

			if (response.ok) return await response.json();

			else {
				console.warn(`
Request.make(): Response Error:
- Status Code: ${response.status}
- Status Text: ${response.statusText}
- URL: ${response.url}
				`);

				return {"type": "error", "message": response.statusText}
			}

		}

		catch(error) {
			console.warn("Request.make(): "+error);
			return {"type": "error", "message": error.message || String(error)}
		}
	}
}

window.x["Request"] = Request;
