export default class Offline extends HTMLElement{
	constructor(){
		super();

		// Closed
		this.shadow = this.attachShadow({mode: 'closed'});
		this.shadow.innerHTML = `
			<dialog>
				<svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="white"><path d="M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm371-120q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Z"/></svg>
				<p>No internet</p>
			</dialog>
			<style>
				dialog{
					display: none;

					background-color: var(--color-main-tint-4);
					pointer-events: none;

					padding: 20px;
					padding-bottom: 0px;

					border: 0px;
					border-radius: var(--radius);
					box-shadow: var(--shadow);

					position: absolute;
					inset: 0;

					&::backdrop{
						opacity: 1;
						background-color: rgba(0, 0, 0, 0.6);
						backdrop-filter: blur(10px);
					}

					&[open]{
						display: flex;
						flex-direction: column;
						align-items: center;
					}
				}
			</style>
		`;

		this.dialog = this.shadow.querySelector("dialog");

		window.addEventListener('online', this.#hide);
		window.addEventListener('offline', this.#show);
	}

	#show = ()=>{
		this.dialog.showModal();

		// disable scrolling
		document.body.style = "overflow: hidden";
	}

	#hide = ()=>{
		this.dialog.close();

		// enable scrolling
		document.body.removeAttribute("style");
	}
};

window.customElements.define('x-offline', Offline);

// Make Modal Usable W/O Importing It
window.x["Offline"] = Offline;
