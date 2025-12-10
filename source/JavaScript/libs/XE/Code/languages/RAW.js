export default class RAW{
	static #code = '';

	static handle(code){
		RAW.#code = code;

		RAW.#strip_blank_edges();
		return RAW.#code;
	}

	// Split into lines, drop empty ones at top & bottom, re-join
	static #strip_blank_edges(){
		const lines = RAW.#code.split(/\r?\n/);

		 // top
		while(lines.length && lines[0].trim() === '')	lines.shift();

		// bottom
		while(lines.length && lines.at(-1).trim() === '')	lines.pop();

		RAW.#code = lines.join('\n');
	}
};
