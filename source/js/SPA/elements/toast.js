// v0.1.2

"use strict";

export default class Toast extends HTMLElement{
	static #selector = "body > toasts";
	static #autoDismissTimer = 5000;
	static #template = document.createElement("template");
	static #ICONS = {
		"success": "done_circle",
		"info": "info_circle",
		"warning": "warning_triangle",
		"error": "error_hexagon"
	}

	constructor(){
		super();

		this.shadow = this.attachShadow({mode: 'closed'});

		Type: {
			this.typeName = "error";

			if(Object.keys(Toast.#ICONS).includes(this.getAttribute("type"))) this.typeName = this.getAttribute("type");
			else this.textContent = `Toast.constructor(): Invalid type "${this.getAttribute('type')}"`;
		}

		CSS: {
			const style = document.createElement('style');

			style.textContent = `
				toast{
					font-size: 1rem;

					overflow: hidden;

					background-color: var(--color-main-tint-1);
					padding: var(--padding);
					margin: 0px;

					border-radius: var(--radius);
					box-shadow: var(--shadow);

					display: grid;
					gap: 10px;
					grid-template-columns:auto 2fr auto;
					align-items: center;

					animation: fadeIn var(--transition-velocity) ease;

					& > toast-type-color{
						background-color: var(--color-${[this.typeName]});
						height: 100%;
						width: 5px;
						border-radius: var(--radius);
					}

					& > main{
						display: grid;
						gap: calc(var(--gap) / 4);
						grid-template-columns:auto 2fr;
						grid-template-areas:
							"icon type"
							"content content";
						align-items: center;

						& > x-svg[for=toast-type-svg]{
							grid-area: icon;
						}

						& > toast-type-name{
							text-transform: uppercase;
							font-weight: bold;
							grid-area: type;
						}

						& > content{
							color: var(--color-text-secondary);
							font-size: 0.8em;
							grid-area: content;
						}
					}
				}

				@keyframes fadeIn{
					0%{transform:translateY(-10px);}
					100%{transform:translateY(0px);}
				}
			`;

			this.shadow.appendChild(style);
		}

		this.shadow.innerHTML += `
			<toast>
				<toast-type-color></toast-type-color>
				<main>
					<x-svg
						for="toast-type-svg"
						name="${Toast.#ICONS[this.typeName]}"
						color="var(--color-${this.typeName})"
					></x-svg>
					<toast-type-name>${window.Lang.use(this.typeName)}</toast-type-name>
					<content>${window.Lang.use(this.textContent)}</content>
				</main>
				<x-svg name="x" for="dismiss"></x-svg>
			</toast>
		`;

		//// Remove Toast On Click Dismiss
		// dismiss.onclick = ()=> this.remove(); // Bug w/ N sec removal
		this.shadow.querySelector("toast > x-svg[for=dismiss]").onclick = ()=> this.style.display = "none";
	}

	static new(type, content){
		if(!!type === false || !!content === false) return;

		document.querySelector(Toast.#selector).innerHTML += `<x-toast type="${type}">${content}</x-toast>`;

		// Auto Remove After N Seconds
		setTimeout(()=>{document.querySelector(Toast.#selector).firstChild?.remove();}, Toast.#autoDismissTimer);
	}

	//// Handles Toast actions by the passed element's "x-toast" attributes
	// x-toast -> enables
	// x-toast="type:error" -> enables with specific only on type action
	// x-toast-type="error|success" -> force type(s)
	// x-toast-message -> force message
	static handleByAttributes(element, response){

	}
}

customElements.define('x-toast', Toast);

// Make Toast Usable W/O Importing It
window.Toast = Toast;
