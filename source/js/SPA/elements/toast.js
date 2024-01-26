// v0.1.1

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

					& > toast-label-color{
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

						& > icon{
							font-size: 1rem;
							grid-area: icon;
						}

						& > type{
							font-size: 1rem;
							text-transform: uppercase;
							font-weight: bold;
							grid-area: type;
						}

						& > content{
							color: var(--color-text-secondary);
							font-size: 0.8rem;
							grid-area:content;
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
				<toast-label-color></toast-label-color>
				<main>
					<icon>
						<x-icon
							name="${Toast.#ICONS[this.typeName]}"
							color="var(--color-${this.typeName})"
						></x-icon>
					</icon>
					<type>${window.Lang.use(this.typeName)}</type>
					<content>${window.Lang.use(this.textContent)}</content>
				</main>
				<x-icon name="x" for="dismiss"></x-icon>
			</toast>
		`;

		//// Remove Toast On Click Dismiss
		// dismiss.onclick = ()=> this.remove(); // Bug w/ N sec removal
		this.shadow.querySelector("toast > x-icon[for=dismiss]").onclick = ()=> this.style.display = "none";
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
