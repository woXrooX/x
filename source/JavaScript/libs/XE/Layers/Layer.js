export default class Layer extends HTMLElement {
	/////////////////////////// Object

	#DOM = null;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'closed' });
		this.#DOM = this.innerHTML;
		this.replaceChildren();

		CSS: {
			const style = document.createElement('style');
			style.textContent = `:host {display: none;}`;
			this.shadow.appendChild(style);
		}

		this.#handle_trigger_click();
	}

	#handle_trigger_click = ()=> {
		const trigger_element = document.querySelector(this.getAttribute("trigger_selector"));
		if (!!trigger_element === false) return;

		trigger_element.onclick = ()=> window.x.Layers.add(
			this.#DOM,
			this.getAttribute("layer_func_execute_on_add"),
			this.getAttribute("layer_func_execute_on_activated"),
			this.getAttribute("layer_data")
		);
	};
}

window.customElements.define('x-layer', Layer);

window.x["Layer"] = Layer;
