// NOTE: HTML string must contain EXACTLY ONE top-level element (a single wrapper)
export default function String_to_Element(string) {
	if (string instanceof Element) return string;

	const template = document.createElement("template");
	template.innerHTML = String(string).trim();

	const element = template.content.firstElementChild;
	if (!element) throw new Error("String_to_Element: Not a valid HTML string.");

	return element;
}
