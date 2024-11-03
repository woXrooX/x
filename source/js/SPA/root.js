export default class Root{
	static selector = "body > div#root";

	// As index.html already has body > div#root element we do not have to wait for DOM creation to use query selector
	static element = Root.element = document.querySelector(Root.selector);
}

// Make Root Usable W/O Importing It
window.x["Root"] = Root;
