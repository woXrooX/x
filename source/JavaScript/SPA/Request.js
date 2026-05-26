export default class Request {
	/////////////////////////// Static


	/////////// APIs

	static async make({
		// Payload
		data = null,
		target_URL = null,

		content_type = "application/json",
		method = "POST",
		cache = "no-cache",
		headers = {},

		cacheable = false
		// cacheable = {
		// 	key_name: "KEY_NAME",
		// 	TTL: 24 * 60 * 60 * 1000
		// }
	}) {
		if (!!data === false) return {"type": "error", "message": "invalid_value"};

		if (cacheable !== false) {
			const cached_data = Request.#get_cache(cacheable["key_name"], cacheable["TTL"]);
			if (cached_data !== false) return cached_data;
		}


		// Set the default URL
		if (!!target_URL === false) target_URL = window.location.href;
		const completed_URL = new URL(target_URL, window.location.origin);


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

			if (response.ok) {
				const response_data = await response.json();

				if (
					cacheable !== false &&
					"data" in response_data
				) Request.#set_cache(cacheable["key_name"], response_data);

				return response_data;
			}

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

	/////////// Helpers

	static #set_cache(key_name, data) {
		localStorage.setItem(
			key_name,
			JSON.stringify({
				data: data,
				timestamp: Date.now()
			})
		);
	}

	static #get_cache(key_name, TTL) {
		// 1 day in ms
		const default_TTL = 24 * 60 * 60 * 1000;

		TTL = TTL || default_TTL;

		const cached_data = localStorage.getItem(key_name);

		if (!cached_data) return false;

		const { data, timestamp } = JSON.parse(cached_data);

		// Expired
		if (Date.now() - timestamp >= TTL) return false;

		return data;
	}
}

window.x["Request"] = Request;
