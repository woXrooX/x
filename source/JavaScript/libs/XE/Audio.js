import { seconds_to_time } from "/JavaScript/modules/datetime/datetime.js";

export default class x_Audio extends HTMLElement {
	/////////////////////////// Static

	static get observedAttributes() {
		return ["source"];
	}

	/////////////////////////// Object

	#audio_object = null;
	#RAW_blob = null;
	#blob_URL_object = null;



	#current_time_element = null;
	#total_time_element = null;

	#play_button_element = null;
	#pause_button_element = null;
	#stop_button_element = null;


	constructor() {
		super();

		this.innerHTML = `
			<row class="flex-row gap-0-5 flex-center width-auto">
				<row class="flex-row width-auto gap-0-2">
					<span class="current_time">00:00</span>
					<span>/</span>
					<span class="total_time">00:00</span>
				</row>

				<row class="flex-row width-auto gap-0-2">
					<x-svg name="play_v1" color="white" class="btn btn-primary"></x-svg>
					<x-svg name="pause_v1" color="white" class="btn btn-primary display-none"></x-svg>
					<x-svg name="stop_v1" color="white" class="btn btn-primary"></x-svg>
				</row>
			</row>
		`;



		this.#current_time_element = this.querySelector("span.current_time");
		this.#total_time_element = this.querySelector("span.total_time");

		this.#play_button_element = this.querySelector("x-svg[name=play_v1]");
		this.#pause_button_element = this.querySelector("x-svg[name=pause_v1]");
		this.#stop_button_element = this.querySelector("x-svg[name=stop_v1]");



		this.#play_button_element.addEventListener("click", () => this.#play());
		this.#pause_button_element.addEventListener("click", () => this.#pause());
		this.#stop_button_element.addEventListener("click", () => this.#stop());



		this.#init_life_cycle();
	}

	disconnectedCallback() {
		// Pause and clean up audio
		if (this.#audio_object) {
			this.#pause();
			this.#audio_object = null;
		}

		// Clean up blob URL to free memory
		if (this.#blob_URL_object) {
			URL.revokeObjectURL(this.#blob_URL_object);
			this.#blob_URL_object = null;
		}
	}

	attributeChangedCallback(attribute_name, old_value, new_value) {
		if (attribute_name != "source") return;
		if (old_value == new_value) return;

		if (this.#audio_object) this.#stop();

		if (!!new_value === false) return;

		this.#init_life_cycle();
	}



	/////////// Helpers

	///// Initiators/Settings

	async #init_life_cycle() {
		if (!this.hasAttribute("source")) return;

		if (await this.#fetch_audio_file() === false) return;

		this.#audio_object = new Audio();

		this.#init_audio_object_listeners();

		this.#set_up_audio_object();

		this.#update_UI_state("ready");
	}

	async #fetch_audio_file() {
		const path_and_file = this.getAttribute("source");
		if (!!path_and_file === false) {
			this.#update_UI_state("error");
			Log.error(`Audio->#fetch_audio_file(): Invalid "source" value: ${path_and_file}`);
			return false;
		}

		this.#update_UI_state("loading");

		try {
			const response = await fetch(
				path_and_file,
				{
					method: "GET",
					mode: "same-origin",
					cache: "force-cache",
					credentials: "include",
				}
			);

			// Check if request was successful
			if (!response.ok) {
				this.#update_UI_state("error");
				Log.error(`Audio->#fetch_audio_file(): ${response.status} ${response.statusText}`);
				return false;
			}

			// Get the audio data as a blob
			const blob = await response.blob();

			if (blob.size === 0) {
				this.#update_UI_state("error");
				Log.error(`Audio->#fetch_audio_file(): Received empty audio file`);
				return false;
			}

			this.#RAW_blob = blob;

			return true;
		}

		catch (error) {
			this.#update_UI_state("error");
			Log.error(`Audio->#fetch_audio_file(): ${error}`);
			return false;
		}
	}

	#init_audio_object_listeners() {
		if (this.#audio_object === null) return;

		// "loadedmetadata" fires when duration and basic info are available
		this.#audio_object.addEventListener("loadedmetadata", () => {
			this.#update_total_time();
		});

		// "timeupdate" fires periodically as audio plays (roughly 4 times/second)
		this.#audio_object.addEventListener("timeupdate", () => {
			this.#update_current_time();
		});

		// "ended" fires when audio finishes playing
		this.#audio_object.addEventListener("ended", () => {
			this.#update_UI_state("stopped");
		});

		this.#audio_object.addEventListener("error", (e) => {
			Log.error(`Audio->#init_audio_object_listeners(): ${this.#audio_object.error}`);
			console.log(this.#audio_object.error);
		});
	}

	#set_up_audio_object() {
		if (this.#audio_object === null) return;

		// Clean up previous blob URL if it exists
		if (this.#blob_URL_object) URL.revokeObjectURL(this.#blob_URL_object);

		this.#blob_URL_object = URL.createObjectURL(this.#RAW_blob);

		this.#audio_object.src = this.#blob_URL_object;

		// Load the audio (triggers "loadedmetadata" event)
		this.#audio_object.load();
	}



	///// Controls

	#play() {
		this.#audio_object.play()
			.then(() => {
				this.#update_UI_state("playing");
			})
			.catch(error => {
				Log.error(`Audio->#play(): ${error}`);
			});
	}

	#pause() {
		this.#audio_object.pause();
		this.#update_UI_state("paused");
	}

	#stop() {
		this.#audio_object.pause();
		this.#audio_object.currentTime = 0;
		this.#update_UI_state("stopped");
	}



	///// Time

	#update_current_time() {
		this.#current_time_element.textContent = seconds_to_time(this.#audio_object.currentTime);
	}

	#update_total_time() {
		if (isNaN(this.#audio_object.duration) == false) this.#total_time_element.textContent = seconds_to_time(this.#audio_object.duration);
	}



	#update_UI_state(state) {
		switch(state) {
			case "loading":
				this.classList.add("disabled");
				Loading.on_element_start(this);
				break;

			case "ready":
				this.classList.remove("disabled");
				Loading.on_element_end(this);
				break;

			case "error":
				this.classList.add("border-error");
				Loading.on_element_end(this);
				break;

			case "playing":
				this.#play_button_element.classList.add("display-none");
				this.#pause_button_element.classList.remove("display-none");
				this.#stop_button_element.classList.remove("disabled");
				break;

			case "paused":
				this.#play_button_element.classList.remove("display-none");
				this.#pause_button_element.classList.add("display-none");
				break;

			case "stopped":
				this.#play_button_element.classList.remove("display-none");
				this.#pause_button_element.classList.add("display-none");
				this.#stop_button_element.classList.add("disabled");
				break;
		}
	}
}

window.customElements.define("x-audio", x_Audio);
