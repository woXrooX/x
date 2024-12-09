export function remove_HTML_from_string(string){
	if(!!string === false) return false;
	const parser = new DOMParser();
	return parser.parseFromString(string, "text/html").documentElement.textContent;
}

export function remove_DOM_from_string(string){
	if(!!string === false) return false;
	const span_element = document.createElement("span");
	span_element.innerHTML = string;
	return span_element.innerText;
}
