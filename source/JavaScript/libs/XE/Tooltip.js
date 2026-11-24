export default class Tooltip extends HTMLElement {
	/////////////////////////// Static

	/////////// Variables

	static #id = 0;
	static #template = document.createElement("template");


	//// Static initialization blocks

	static {
		Tooltip.#template.innerHTML = `
			<style>
				:host {
					position: fixed;
					inset: auto;
					margin: 0;
					top: calc(anchor(bottom) + var(--padding));

					left: var(--padding);
					right: var(--padding);
					justify-self: anchor-center;
					position-try-fallbacks: flip-block;
					position-visibility: anchors-visible;
					width: max-content;
					max-width: calc(100vw - var(--padding) * 2);

					overflow: hidden;
					pointer-events: none;
					opacity: 0;
					transform: scale(0.5);

					/*
						"display" and "overlay" keep it rendered and in the top layer until the exit transition ends.
						transition-behavior goes after the shorthand, which would reset it.
					*/
					transition: var(--transition-velocity);
					transition-property: opacity, transform, display, overlay;
					transition-behavior: allow-discrete;
					will-change: opacity, transform;

					background-color: var(--color-hsla-0-0-100-0-1);
					color: var(--color-text-primary);
					border-radius: var(--radius);
					border: 1px solid var(--color-brand-tint-2);
					box-shadow: var(--shadow);
					backdrop-filter: blur(var(--blur));

					place-items: center;
				}

				:host(:popover-open) {
					display: grid;
					pointer-events: all;
					opacity: 1;
					transform: scale(1);

					@starting-style {
						opacity: 0;
						transform: scale(0.5);
					}
				}
			</style>

			<slot></slot>
		`;
	}


	/////////////////////////// Object

	/////////// Variables

	#anchor_name = '';
	#trigger_element = null;
	#abort_controller = null;


	/////////// APIs

	constructor() {
		super();

		Tooltip.#id += 1;
		this.#anchor_name = `--anchor-${Tooltip.#id}`;

		this.attachShadow({mode: "closed"}).append(Tooltip.#template.content.cloneNode(true));
	}

	connectedCallback() {
		this.#abort_controller = new AbortController();

		this.#set_up_this_element();
		this.#set_up_trigger_element();
		this.#handle_trigger();
	}

	disconnectedCallback() {
		this.#abort_controller.abort();
		this.#trigger_element?.style.removeProperty("anchor-name");
	}


	/////////// Helpers

	#set_up_trigger_element() {
		if (this.hasAttribute("trigger_selector")) {
			this.#trigger_element = document.querySelector(this.getAttribute("trigger_selector"));
			this.#trigger_element.style.setProperty("anchor-name", this.#anchor_name);
		}

		else {
			this.#trigger_element = this.previousElementSibling;
			this.#trigger_element.style.setProperty("anchor-name", this.#anchor_name);
		}
	}

	#set_up_this_element() {
		this.style.setProperty("position-anchor", this.#anchor_name);

		// Top layer: painted above the whole page, outside every stacking context
		// "manual" leaves opening and closing to us.
		this.setAttribute("popover", "manual");
	}

	#handle_trigger = () => {
		if (!this.#trigger_element) return false;

		switch (this.getAttribute("trigger_type")) {
			case "hover":
				this.#handle_trigger_hover();
				break;

			case "click":
				this.#handle_trigger_click();
				break;

			// case "auto":
			// 	this.#handle_trigger_auto();
			// 	break;

			default:
				this.#handle_trigger_hover();
				break;
		}
	};

	#handle_trigger_hover = () => {
		const signal = this.#abort_controller.signal;

		this.#trigger_element.addEventListener("mouseenter", () => this.showPopover(), {signal});
		this.#trigger_element.addEventListener("mouseleave", () => this.hidePopover(), {signal});
	};

	// Prevent to trigger on touchscreens
	// #handle_trigger_hover = () => {
	// 	const signal = this.#abort_controller.signal;

	// 	this.#trigger_element.addEventListener("mouseenter", () => {
	// 		// Prevent to trigger on touchscreens
	// 		if (matchMedia("(hover: hover) and (pointer: fine)").matches === false) return;

	// 		this.showPopover();
	// 	}, {signal});

	// 	this.#trigger_element.addEventListener("mouseleave", () => this.hidePopover(), {signal});
	// };

	#handle_trigger_click = () => {
		const signal = this.#abort_controller.signal;

		this.#trigger_element.addEventListener("click", (event) => {
			// Prevent the click from immediately closing the tooltip
			event.stopPropagation();

			// Re-clicking on the trigger_element serves as close tooltip as well
			this.togglePopover();
		}, {signal});

		// Document-level click handler to close tooltip when clicking outside
		document.addEventListener("click", (event) => {
			if (
				this.matches(":popover-open") &&
				!this.contains(event.target) &&
				!this.#trigger_element.contains(event.target)
			) this.hidePopover();
		}, {signal});
	};
};

customElements.define("x-tooltip", Tooltip);

window.x["Tooltip"] = Tooltip;
