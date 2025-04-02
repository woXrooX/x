// v0.1.1

"use strict";

export default class Copy extends HTMLElement{
	static #template = document.createElement("template");

	static {
		Copy.#template.innerHTML = `
			<copy></copy>
		`;
	}

	constructor(){
		super();

		// Closed
		this.shadow = this.attachShadow({mode: 'closed'});

		Selector: {
			if(this.hasAttribute("selector")) this.selector = this.getAttribute("selector");
		}

		CSS: {
			const style = document.createElement('style');
			style.textContent = `
				copy{
					cursor: pointer;

					display: inline-block;

					font-size: 1em;
					width: 1em;
					height: 1em;
					padding: 0;
					margin: 0;
					box-sizing: border-box;

					background-size: contain;
					background-repeat: no-repeat;
					background-color: transparent;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='%23FFFFFF'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M19 2h-4.18C14.4.84 13.3 0 12 0S9.6.84 9.18 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z'/%3E%3C/svg%3E");
				}
			`;

			this.shadow.appendChild(style);
		}

		// Clone And Append Template
		this.shadow.appendChild(Copy.#template.content.cloneNode(true));

		ClickEvents: {

			this.copyElement = this.shadow.querySelector("copy");
			this.isClicked = false;

			this.onclick = ()=>{
				// Check If Selector Passed As Argument
				if(!!this.selector === false) return;

				// Select The Element
				const element = document.querySelector(this.selector);

				// Check If Corresponding Element To The Selector Exists
				if(!!element === false) return;

				// Check If Already Clicked
				if(!!this.isClicked === true) return;

				// State: Clicked
				this.isClicked = true;

				// Copy The Value
				navigator.clipboard.writeText(element.innerText);

				// Disable The Copy Button
				this.copyElement.setAttribute("disabled", "");

				// Change The Copy Icon To Done
				this.copyElement.style = `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' enable-background='new 0 0 24 24' height='24px' viewBox='0 0 24 24' width='24px' fill='%2300820a'%3E%3Cg%3E%3Crect fill='none' height='24' width='24'/%3E%3C/g%3E%3Cg%3E%3Cg%3E%3Cpath d='M5,5h2v3h10V5h2v5h2V5c0-1.1-0.9-2-2-2h-4.18C14.4,1.84,13.3,1,12,1S9.6,1.84,9.18,3H5C3.9,3,3,3.9,3,5v14 c0,1.1,0.9,2,2,2h6v-2H5V5z M12,3c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S11.45,3,12,3z'/%3E%3Cpolygon points='21,11.5 15.51,17 12.5,14 11,15.5 15.51,20 22.5,13'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");`;

				// Restore The Un-Clicked State
				setTimeout(()=>{
					// Enable The Copy Button
					this.copyElement.removeAttribute("disabled");

					// Back To Copy Icon
					this.copyElement.style = `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='%23FFFFFF'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M19 2h-4.18C14.4.84 13.3 0 12 0S9.6.84 9.18 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z'/%3E%3C/svg%3E");`;

					// State: Un-Clicked
					this.isClicked = false;
				}, 5000);
			};
		}
	}
};

window.customElements.define('x-copy', Copy);
