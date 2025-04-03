export default class Root{
	static selector = "body > div#root";

	// As index.html already has body > div#root element we do not have to wait for DOM creation to use query selector
	static element = Root.element = document.querySelector(Root.selector);
}

window.x["Root"] = Root;
