export default class Images extends HTMLElement{
	#JSON = {};
	#main_element = null;
	#first_img_element = null;

	constructor(){
		super();
		this.#JSON = JSON.parse(this.innerHTML).constructor === Object ? JSON.parse(this.innerHTML) : {};
		this.#JSON["width"] = this.#JSON["height"] ?? "100px";
		this.#JSON["height"] = this.#JSON["height"] ?? "100px";

		this.replaceChildren();
		this.shadow = this.attachShadow({mode: 'closed'});

		DOM: {
			let imgs = "";
			for(const img of this.#JSON["images"]) imgs += `<div><img src="${img}"></div>`;

			this.shadow.innerHTML = `
				<style>
					:host{
						display: inline-block;
						width: ${this.#JSON["width"]};
						height: ${this.#JSON["height"]};

						cursor: pointer;
						user-select: none;

						overflow: hidden;
					}
					main{
						display: inline-block;
						width: ${this.#JSON["width"]};
						height: ${this.#JSON["height"]};

						/* Disable scrollbar START */
						-ms-overflow-style: none; /* IE and Edge */
						scrollbar-width: none; /* Firefox */

						&::-webkit-scrollbar{
							display: none;
						}
						/* Disable scrollbar END */

						& > :first-child{
							display: block;
							width: ${this.#JSON["width"]};
							height: ${this.#JSON["height"]};
							transform: scale(1);
							overflow: hidden;

							&::after{
								pointer-events: none;
								content: '${this.#JSON["images"].length}';
								opacity: 0;

								background-color: rgba(0, 0, 0, 0.7);
								color: white;

								font-size: 250%;

								width: 100%;
								height: 100%;

								display: grid;
								place-items: center;

								position: absolute;
								top: 0px;
								left: 0px;
								z-index: 21;

								transition: opacity ease-in-out 250ms;
							}

							&:hover{
								&::after{
									opacity: 1;
								}
							}


							& > img{
								width: ${this.#JSON["width"]};
								height: ${this.#JSON["height"]};
								object-fit: ${this.#JSON["object-fit"] ?? "initial"};
							}
						}

						& > div{
							display: none;
							width: 0px;
							height: 0px;
							transform: scale(0);
						}

						&.active{
							background: hsla(0deg, 0%, 0%, 0.5);
							backdrop-filter: blur(20px);
							-webkit-backdrop-filter: blur(20px);

							height: 100dvh;
							width: 100dvw;

							overflow-y: hidden;
							overflow-x: scroll;
							scroll-snap-type: x mandatory;

							display: flex;
							flex-direction: row;

							position: fixed;
							top: 0;
							left: 0;
							z-index: 20;

							& > :first-child{
								&:hover{
									&::after{
										transition: opacity ease-in-out 0ms;
										opacity: 0;
									}
								}
							}

							& > div{
								overflow: hidden;

								transform: unset;
								width: unset;
								height: unset;

								min-width: 100dvw;
								min-height: 100dvh;

								scroll-snap-align: start;

								display: grid;
								place-content: center;

								& > img{
									cursor: initial;
									width: auto;
									height: auto;
									max-width: 90dvw;
									max-height: 90dvh;
									object-fit: contain;
									filter: drop-shadow(0px 5px 20px rgba(0, 0, 0, 0.8));
								}
							}
						}
					}
				</style>

				<main>${imgs}</main>
			`;
		}

		Listeners: {
			this.#main_element = this.shadow.querySelector("main");
			this.#first_img_element = this.shadow.querySelector("main > :first-child");

			this.#first_img_element.onclick = (event)=>{
				if(!this.#main_element.classList.contains("active")) this.#show();
			};

			this.#main_element.onclick = (event)=>{
				if(event.target.nodeName !== "IMG" && this.#main_element.classList.contains("active")) this.#hide();
			};
		}
	}

	#show(){
		this.#main_element.classList.add("active");

		// disable scrolling
		document.body.style = "overflow: hidden";
	}

	#hide(){
		this.#main_element.classList.remove("active");

		// enable scrolling
		document.body.removeAttribute("style");
	}
};

window.customElements.define('x-images', Images);

// Make WC Usable W/O Importing It
window.Images = Images;
