export default class Layer extends HTMLElement {
	#DOM = null;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'closed' });
		this.#DOM = this.innerHTML;
		this.replaceChildren();

		this.#handle_trigger_click();
	}

	#handle_trigger_click = ()=> {
		const trigger_element = document.querySelector(this.getAttribute("trigger_selector"));
		if(!!trigger_element === false) return;

		trigger_element.onclick = ()=> window.x.Layers.add(this.#DOM);
	};
}

window.customElements.define('x-layer', Layer);

window.x["Layer"] = Layer;
