export default function removeHTMLFromString(string){
	if(!!string === false) return false;
	const parser = new DOMParser();
	return parser.parseFromString(string, "text/html").documentElement.textContent;
}
