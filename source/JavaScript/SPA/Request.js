export default class Request {
	/////////////////////////// Static


	/////////// APIs

	static async make({
		payload = null,
		target_URL = undefined,

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
		if (!!payload === false) return {"type": "error", "message": "invalid_value"};

		if (cacheable !== false) {
			const cached_data = Request.#get_cache(cacheable["key_name"], cacheable["TTL"]);
			if (cached_data !== false) return cached_data;
		}


		// Set the default URL
		if (!!target_URL === false) target_URL = window.location.href;
		const completed_URL = new URL(target_URL, window.location.origin);


		const CSRF_meta_element = document.querySelector('meta[name="x-CSRF-token"]');
		if (CSRF_meta_element) headers["x-CSRF-token"] = CSRF_meta_element.getAttribute("content");


		const { body, content_type_headers } = Request.#handle_content_type(payload, content_type);

		headers = {
			...headers,
			...content_type_headers
		};

		try {
			const response = await fetch(completed_URL, {
				method: method,
				mode: "same-origin",
				cache: cache,
				credentials: "include",
				headers: headers,
				redirect: "follow",
				referrerPolicy: "no-referrer",
				body: body
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

	static #handle_content_type(payload, content_type) {
		let body;
		let headers = {};

		switch (content_type) {
			case "application/json":
				headers["Content-Type"] = "application/json";
				body = JSON.stringify(payload);
				break;

			case "multipart/form-data":
				// Let browser set Content-Type with boundary for FormData
				body = payload;
				break;

			case "application/x-www-form-urlencoded":
				headers["Content-Type"] = "application/x-www-form-urlencoded";
				body = new URLSearchParams(payload).toString();
				break;

			default:
				headers["Content-Type"] = content_type;
				body = payload;
				break;
		}

		return {
			"body": body,
			"content_type_headers": headers
		}

	}
}

window.x["Request"] = Request;
