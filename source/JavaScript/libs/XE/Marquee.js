export default class Marquee extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					width: 100%;
					overflow: hidden;
				}

				main {
					position: relative;
					width: 100%;
					overflow: hidden;
					mask-image: linear-gradient(
						to right,
						transparent,
						black 10%,
						black 90%,
						transparent 100%
					);
					-webkit-mask-image: linear-gradient(
						to right,
						transparent,
						black 10%,
						black 90%,
						transparent 100%
					);
				}

				section {
					display: flex;
					gap: 30px;
					animation: marquee 15s linear infinite;
					position: relative;
					white-space: nowrap;
				}

				section:hover {
					animation-play-state: paused;
				}

				@keyframes marquee {
					0% {
						transform: translateX(100%);
					}
					100% {
						transform: translateX(-100%);
					}
				}
			</style>

			<main>
				<section>
					<slot></slot>
				</section>
			</main>
		`;
	}
}

// Define the custom element
window.customElements.define('x-marquee', Marquee);
