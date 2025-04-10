export default class Marquee extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
			<style>
				:host {
					pointer-events: none;

					display: block;
					width: 100%;
					height: 100%;
					max-width: 100dvw;
					max-height: 100dvh;
				}

				main {
					display: flex;
					gap: 30px;
					white-space: nowrap;
					mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent 100%);
				}

				main:hover section {
					animation-play-state: paused;
				}

				section {
					display: flex;
					gap: 30px;
					animation: marquee 15s linear infinite;
				}

				@keyframes marquee {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(calc(-100% - 30px));
					}
				}
			</style>

			<main>
				<section>
					<slot></slot>
				</section>
				<section>
					<slot name="duplicate"></slot>
				</section>
			</main>
		`;
	}

	connectedCallback() {
		// Create a static copy of children
		const child_elements = Array.from(this.children);

		// Clone the children, add them as duplicates and append
		for (const child of child_elements) {
			const clone = child.cloneNode(true);
			clone.setAttribute('slot', 'duplicate');
			this.appendChild(clone);
		}
	}
}

window.customElements.define('x-marquee', Marquee);
