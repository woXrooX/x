export default class Layer extends HTMLElement {
	/////////////////////////// Static

	/////////// APIs

	static build_DOM_HTML(id, content){
		return `
			<container id="layer_${id}" class="adding">
				<cover></cover>
				<layer class="surface-v1 overflow-hidden">
					<x-svg
						class="
							btn	btn-primary btn-s

							position-fixed
							top-5px
							right-5px
						"
						for="layer_remove"
						name="x"
						color="ffffff"
					></x-svg>
					<main
						class="
							overflow-y-scroll
							width-100
							height-100
							padding-top-2rem
						"
					>${content}</main>
				</layer>
			</container>
		`;
	}


	/////////////////////////// Object

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
		if (!!trigger_element === false) return;

		trigger_element.onclick = ()=> window.x.Layers.add(
			this.#DOM,
			this.getAttribute("layer_func"),
			this.getAttribute("layer_data")
		);
	};
}

window.customElements.define('x-layer', Layer);

window.x["Layer"] = Layer;
