export default class HTML{
	static #code = '';
	static #tokens = [];
	static #current	= 0;

	// Expects escaped HTML
	static handle(code){
		HTML.#code = code;

		HTML.#reset();
		HTML.#strip_blank_edges();
		HTML.#tokenize();
		return HTML.#render_highlighted_code();
	}

	static #reset(){
		HTML.#tokens = [];
		HTML.#current = 0;
	}

	// Split into lines, drop empty ones at top & bottom, re-join
	static #strip_blank_edges(){
		const lines = HTML.#code.split(/\r?\n/);

		 // top
		while(lines.length && lines[0].trim() === '')	lines.shift();

		// bottom
		while(lines.length && lines.at(-1).trim() === '')	lines.pop();

		HTML.#code = lines.join('\n');
	}

	static #render_highlighted_code(){
		let out = '';

		for (const token of HTML.#tokens) {
			let span = '';

			switch (token.type) {
				case "comment":
					span = `<span style="color: grey;">${token.value}</span>`;
					break;

				case "symbol":
					span = `<span style="color: white;">${token.value}</span>`;
					break;

				case "string":
					span = `<span style="color: hsla(124,38%,58%,1);">${token.value}</span>`;
					break;

				case "element_name":
					span = `<span style="color: red;">${token.value}</span>`;
					break;

				case "attribute":
					span = `<span style="color: orange;">${token.value}</span>`;
					break;

				case "text":
					span = `<span style="color: white;">${token.value}</span>`;
					break;

				case "whitespace":
					span = `<span>${token.value}</span>`;
					break;

				case "newline":
					span = `<span>${token.value}</span>`;
					break;

				default: span = `<span style="color: grey;">${token.value}</span>`;
			}

			out += span;
		}

		return out;
	}

	static #tokenize(){
		Main: while (HTML.#current < HTML.#code.length) {
			if(HTML.#code[HTML.#current] === ' '){
				HTML.#handle_whitespace();
				continue Main;
			}

			if (HTML.#code[HTML.#current] === '\n' || HTML.#code[HTML.#current] === '\r') {
				HTML.#handle_newline();
				continue Main;
			}

			if (HTML.#code.substring(HTML.#current, HTML.#current + 4) === "&lt;") {
				HTML.#handle_element();
				continue Main;
			}

			HTML.#tokens.push({type: "text", value: HTML.#code[HTML.#current]});
			HTML.#current++;
		}
	}

	static #handle_whitespace(){
		HTML.#tokens.push({type: "whitespace", value: ' '});
		HTML.#current++;
	}

	static #handle_newline(){
		HTML.#tokens.push({type: "newline", value: '\n'});
		HTML.#current++;
	}

	static #handle_comment(){
		HTML.#tokens.push({type: "comment", value:"&lt;!--"});

		// skip "&lt;!--"
		HTML.#current += 7;

		while (HTML.#code.substring(HTML.#current, HTML.#current + 6) !== "--&gt;" && HTML.#current < HTML.#code.length) {
			HTML.#tokens.push({type: "comment", value: HTML.#code[HTML.#current]});
			HTML.#current++;
		}

		HTML.#tokens.push({type: "comment", value: "--&gt;"});

		// skip "--&gt;"
		HTML.#current += 6;
	}

	static #handle_element(){
		// Comment ?
		if (HTML.#code.substring(HTML.#current + 4, HTML.#current + 7) === "!--") {
			HTML.#handle_comment();
			return;
		}

		// Opening "&lt;"
		HTML.#handle_symbols('<', 4);

		// Optional '/'
		if (HTML.#code[HTML.#current] === '/') HTML.#handle_symbols();

		// Element name
		let name = '';
		while (/[A-Za-z0-9:-]/.test(HTML.#code[HTML.#current]) && HTML.#current < HTML.#code.length) name += HTML.#code[HTML.#current++];
		if (name) HTML.#tokens.push({type: "element_name", value: name});

		while (HTML.#current < HTML.#code.length) {
			if ("=/!".includes(HTML.#code[HTML.#current])) {
				HTML.#handle_symbols();
				continue;
			}

			if (HTML.#code[HTML.#current] === '"' || HTML.#code[HTML.#current] === "'") {
				HTML.#handle_string();
				continue;
			}

			if (HTML.#code.substring(HTML.#current, HTML.#current + 4) === "&gt;") {
				HTML.#handle_symbols('>', 4);
				break;
			}

			HTML.#tokens.push({type: "attribute", value: HTML.#code[HTML.#current]});
			HTML.#current++;
		}
	}

	static #handle_symbols(symbol=null, len=1){
		HTML.#tokens.push({type: "symbol", value: symbol || HTML.#code[HTML.#current]});
		HTML.#current += len;
	}

	static #handle_string(){
		const quote = HTML.#code[HTML.#current];
		let string = quote;

		while (HTML.#code[++HTML.#current] !== quote && HTML.#current < HTML.#code.length) string += HTML.#code[HTML.#current];

		// closing quote
		string += quote;
		HTML.#tokens.push({type: "string", value: string});

		// step past closing quote
		HTML.#current++;
	}
};
