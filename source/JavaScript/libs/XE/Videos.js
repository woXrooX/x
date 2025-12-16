import { seconds_to_time } from "/JavaScript/modules/datetime/datetime.js";

export default class Videos extends HTMLElement {
	#JSON = {};
	#main_element = null;
	#video_object = null;

	#play_button_element = null;
	#pause_button_element = null;
	#fullscreen_button_element = null;
	#seek_bar_element = null;
	#prev_overflow = "";

	#current_time_element = null;
	#total_time_element = null;

	constructor() {
		super();

		this.#JSON = JSON.parse(this.innerHTML).constructor === Object ? JSON.parse(this.innerHTML) : {};
		this.#JSON["width"] = this.#JSON["height"] ?? "100px";
		this.#JSON["height"] = this.#JSON["height"] ?? "100px";

		this.innerHTML = `
			<style>
				:host {
					display: inline-block;
					width: ${this.#JSON["width"]};
					height: ${this.#JSON["height"]};

					cursor: pointer;
					user-select: none;

					overflow: hidden;
				}

				main {
					width: ${this.#JSON["width"]};
					height: ${this.#JSON["height"]};

					& div {
						position: relative;
						width: 100%;
						height: 100%;
						overflow: hidden;

						&:hover .controls {
							opacity: 1;
							pointer-events: auto;
						}

						& video {
							width: ${this.#JSON["width"]};
							height: ${this.#JSON["height"]};
							object-fit: ${this.#JSON["object-fit"] ?? "cover"};
							display: block;
							cursor: pointer;
						}

						& .controls {
							position: absolute;
							bottom: 0;
							left: 50%;
							z-index: 3;
							transform: translateX(-50%);

							background: rgba(0,0,0,.6);
							opacity: 0;

							pointer-events: none;
							transition: opacity 200ms;
						}
					}

					/* FULLSCREEN MODE */
					&.active {
						position: fixed;
						inset: 0;
						width: 100dvw;
						height: 100dvh;
						z-index: 20;
						display: grid;
						place-items: center;

						&::before {
							content: "";
							position: fixed;
							inset: 0;
							background: rgba(0,0,0,.5);
							backdrop-filter: blur(20px);
							-webkit-backdrop-filter: blur(20px);
							z-index: 0;
						}

						& div {
							max-width: 80dvw;
							max-height: 80dvh;
							z-index: 1;
							box-shadow: 0 5px 20px rgba(0,0,0,.8);

							& video {
								max-width: 100dvw;
								max-height: 100dvh;
								object-fit: ${this.#JSON["object-fit"] ?? "cover"};
							}
						}

					}
				}
			</style>

			<main>
				<div>
					<video src="${this.#JSON["video"]}"></video>

					<row class="controls width-auto flex-row flex-center gap-0-3 radius-default padding-1">
						<x-svg name="play_v1" color="white" class="btn btn-s btn-primary"></x-svg>
						<x-svg name="pause_v1" color="white" class="btn btn-s btn-primary display-none"></x-svg>
						<input type="range" class="width-200px" min="0" value="0" step="0.1">

						<row class="flex-row width-auto gap-0-2 text-size-0-8">
							<span class="current_time">00:00</span>
							<span>/</span>
							<span class="total_time">00:00</span>
						</row>

						<x-svg name="fullscreen" color="white" class="btn btn-s btn-primary"></x-svg>
					</row>
				</div>
			</main>
		`;

		this.#video_object = this.querySelector("video");
		this.#play_button_element = this.querySelector("x-svg[name='play_v1']");
		this.#pause_button_element = this.querySelector("x-svg[name='pause_v1']");
		this.#seek_bar_element = this.querySelector("input[type=range]");
		this.#fullscreen_button_element = this.querySelector("x-svg[name='fullscreen']");

		this.#current_time_element = this.querySelector("span.current_time");
		this.#total_time_element = this.querySelector("span.total_time");

		Listeners: {
			this.#main_element = this.querySelector("main");
			this.#main_element.onclick = (event) => {
				if(event.target === this.#main_element && this.#main_element.classList.contains("active")) this.#hide();
			};

			this.#play_button_element.addEventListener("click", () => this.#play());
			this.#pause_button_element.addEventListener("click", () => this.#pause());
			this.#fullscreen_button_element.addEventListener("click", () => this.#fullscreen());

			document.addEventListener('keydown', (e) => {
				if (this.#main_element.classList.contains("active") && e.key === "Escape") this.#hide();
			});
		}

		this.#build_seek_bar();
	}

	///// Controls

	#play(){
		this.#video_object.play();

		this.#video_object.onplay = () => {
			this.#play_button_element.classList.add("display-none");
			this.#pause_button_element.classList.remove("display-none");
		};
	}

	#pause(){
		this.#video_object.pause();

		this.#video_object.onpause = () => {
			this.#pause_button_element.classList.add("display-none");
			this.#play_button_element.classList.remove("display-none");
		};
	}

	#build_seek_bar(){
		// Load metadata to display duration immediately
		this.#video_object.onloadedmetadata = () => { this.#update_total_time(); };

		this.#video_object.ontimeupdate = () => {
			this.#seek_bar_element.max = this.#video_object.duration || 0;
			this.#seek_bar_element.value = this.#video_object.currentTime;
			this.#update_current_time();
		};

		this.#seek_bar_element.oninput = e => {
			e.stopPropagation();
			this.#video_object.currentTime = parseFloat(this.#seek_bar_element.value);
		};
	}

	#fullscreen(){
		if (!this.#main_element.classList.contains("active")) this.#show();
		else this.#hide();
	}


	///// Time

	#update_current_time() {
		this.#current_time_element.textContent = seconds_to_time(this.#video_object.currentTime);
	}

	#update_total_time() {
		if (isNaN(this.#video_object.duration) == false) this.#total_time_element.textContent = seconds_to_time(this.#video_object.duration);
	}



	#show(){
		this.#main_element.classList.add("active");

		// disable scrolling
		document.body.style.overflow = "hidden";
	}

	#hide(){
		this.#main_element.classList.remove("active");

		// enable scrolling
		document.body.removeAttribute("style");
	}
}

customElements.define("x-videos", Videos);
window.Videos = Videos;
