export default class Logger {
	/////////////////////////// Static



	/////////// APIs

	static success(text, force = false) {
		Logger.#log(text, "success");
	}

	static info(text, force = false) {
		Logger.#log(text, "info");
	}

	static warning(text, force = false) {
		Logger.#log(text, "warning");
	}

	static important(text, force = false) {
		Logger.#log(text, "important", force);
	}

	static error(text, force = false) {
		Logger.#log(text, "error", force);
	}

	static urgent(text, force = false) {
		Logger.#log(text, "urgent", force);
	}



	/////////// Helpers

	static #log(text, type, force = false) {
		if (
			"tools" in window.x["configurations"] &&
			window.x["configurations"].tools.debug === false &&
			force === false
		) return;

		// Type color
		const color = `color: ${x.CSS.get_value(`--color-${type}`) || 'white'}`;

		// Timestamp
		const now = new Date();
		const timestamp = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

		console.log(`%c[${timestamp}][${type.toUpperCase()}] `, color, text);
	}
}

// Log is alias to logger
class Log extends Logger {}

window.Logger = Logger;
window.Log = Log;
