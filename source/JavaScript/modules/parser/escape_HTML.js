const HTML_escape_map = Object.freeze({
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'`': '&#96;',
	'=': '&#61;',
	'/': '&#47;'
});

const HTML_escape_re = /[&<>"'`=\/]/g;

export default function escape_HTML(string) {
	if (!!string === false) return '';
	return String(string).replace(HTML_escape_re, char => HTML_escape_map[char]);
}
