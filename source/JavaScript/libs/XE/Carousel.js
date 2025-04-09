export default class Carousel extends HTMLElement {

	/////////////////////////// Static

	static #animation_duration = 1000;
	static #auto_scroll_interval = 3000;

	/////////////////////////// Object

	#auto_scroll_timeout = null;
	#scroll_interval = null;
	#auto_scroll_interval_after_touch = 5000;

	#offset = 0;
	#gap = 0;
	#resize_observer_object = null;
	#card_width = 0;
	#previous_button = null;
	#next_button = null;
	#animating = false;

	#touch_start_x = 0;
	#swipe_threshold = 30;

	constructor() { super(); }

	connectedCallback() {
		this.#calculate_values();
		this.#resize_observer();
		this.#style_host();
		this.#init_buttons();
		this.#center_cards();
		this.#start_auto_scroll();
		this.#init_event_listeners();
	}

	disconnectedCallback() {
		this.#stop_auto_scroll();
		this.#resize_observer_object.disconnect();
	}


	#calculate_values() {
		const computed_style = getComputedStyle(this);

		this.cards = this.#generate_cards();
		this.#gap = parseInt(computed_style.gap);
		this.#card_width = this.cards[0].offsetWidth;

		const container_width = this.offsetWidth - parseInt(computed_style.paddingLeft) - parseInt(computed_style.paddingRight);

		// Core positioning logic
		this.#offset = this.#card_width + this.#gap - (container_width - this.#card_width) / 2;
		this.#offset = Math.abs(this.#offset);
	}

	#resize_observer() {
		this.#resize_observer_object = new ResizeObserver(() => {
			this.#calculate_values();
			this.#center_cards();
		});

		this.#resize_observer_object.observe(this);
	}

	#style_host() {
		this.style = `
			display: flex;
			overflow: hidden;
			mask-image: linear-gradient(
				to right,
				rgba(0, 0, 0, 0),
				rgba(0, 0, 0, 1) 2%,
				rgba(0, 0, 0, 1) 98%,
				rgba(0, 0, 0, 0)
			);
			position: relative;
		`;
	}

	#init_buttons(){
		previous: {
			this.#previous_button = document.createElement("button");
			this.#previous_button.innerHTML = `<x-svg name="arrow_back_v2" color="white"></x-svg>`;
			this.#previous_button.className = "btn btn-primary position-absolute width-auto height-auto padding-2 left-20px opacity-0 radius-circle";
			this.#previous_button.style = `
				top: 50%;
				transform: translateY(-50%);
				transition: opacity 0.3s ease;
				z-index: 4;
			`;
			this.appendChild(this.#previous_button);
		}

		next: {
			this.#next_button = document.createElement("button");
			this.#next_button.innerHTML = `<x-svg name="arrow_forward_v2" color="white"></x-svg>`;
			this.#next_button.className = "btn btn-primary position-absolute width-auto height-auto padding-2 right-20px opacity-0 radius-circle";
			this.#next_button.style = `
				top: 50%;
				transform: translateY(-50%);
				transition: opacity 0.3s ease;
				z-index: 4;
			`;
			this.appendChild(this.#next_button);
		}

		// Hide buttons on mobile
		if ("ontouchstart" in window) {
		  this.#previous_button.style.display = 'none';
		  this.#next_button.style.display = 'none';
		}
	}

	#center_cards() {
		for (const card of this.cards){
			card.style.transition = 'none';
			card.style.transform = `translateX(-${this.#offset}px)`;
		}
	}

	#start_auto_scroll() {
		this.#scroll_interval = setInterval(() => this.#scroll_to_next_card(), Carousel.#auto_scroll_interval);
	}

	#init_event_listeners() {
		this.addEventListener("mouseenter", () =>{
			this.#stop_auto_scroll();
			this.#previous_button.style.opacity = "1";
			this.#next_button.style.opacity = "1";
		});

		this.addEventListener("mouseleave", () =>{
			this.#start_auto_scroll();
			this.#previous_button.style.opacity = "0";
			this.#next_button.style.opacity = "0";
		});

		this.addEventListener("touchstart", this.#handle_touch_start);
		this.addEventListener("touchend", this.#handle_touch_end);

		this.#previous_button.onclick = () => this.#scroll_to_previous_card();
		this.#next_button.onclick = () => this.#scroll_to_next_card();
	}


	/////////// Helpers

	#stop_auto_scroll() {
		clearInterval(this.#scroll_interval);
		this.#scroll_interval = null;
	}

	#handle_touch_start = (event) => {
		if (!event.touches || event.touches.length === 0) return;

		this.#stop_auto_scroll();
		this.#touch_start_x = event.touches[0].clientX;

		clearTimeout(this.#auto_scroll_timeout);
		this.#auto_scroll_timeout = setTimeout(() => { this.#start_auto_scroll(); }, this.#auto_scroll_interval_after_touch);
	}

	#handle_touch_end = (event) => {
		if (!event.changedTouches || event.changedTouches.length === 0) return;

		const touch_end_x = event.changedTouches[0].clientX;
		const delta_x = touch_end_x - this.#touch_start_x;

		if (Math.abs(delta_x) > this.#swipe_threshold){
			if(delta_x > 0) this.#scroll_to_previous_card();
			else this.#scroll_to_next_card();
		}
	}

	#scroll_to_previous_card() {
		if (this.#animating) return;
		this.#animating = true;

		const last_card = this.cards[this.cards.length - 1];
		const clone = last_card.cloneNode(true);

		clone.style.transform = `translateX(-${this.#offset + this.#card_width + this.#gap}px)`;
		this.insertBefore(clone, this.cards[0]);

		const initial_offset = this.#offset + this.#card_width + this.#gap;
		this.cards = this.#generate_cards();

		for (const card of this.cards) {
			card.style.transition = 'none';
			card.style.transform = `translateX(-${initial_offset}px)`;
		}

		// Force layout synchronization
		void this.offsetWidth;

		for (const card of this.cards) {
			card.style.transition = `transform ${Carousel.#animation_duration}ms ease`;
			card.style.transform = `translateX(-${this.#offset}px)`;
		}

		last_card.addEventListener("transitionend", () => {
			this.removeChild(last_card);
			this.cards = this.#generate_cards();

			for (const card of this.cards) {
				card.style.transition = 'none';
				card.style.transform = `translateX(-${this.#offset}px)`;
			}

			this.#animating = false;
		});
	}

	#scroll_to_next_card() {
		if (this.#animating) return;
		this.#animating = true;

		const first_card = this.cards[0];
		const clone = first_card.cloneNode(true);

		// Prepare clone position
		clone.style.transform = `translateX(-${this.#offset}px)`;
		this.appendChild(clone);

		// Force layout synchronization
		void this.offsetWidth;

		// Animate all cards
		this.cards = this.#generate_cards();

		for (const card of this.cards){
			card.style.transition = `transform ${Carousel.#animation_duration}ms ease`;
			card.style.transform = `translateX(-${this.#offset + this.#card_width + this.#gap}px)`;
		}

		first_card.addEventListener("transitionend", ()=>{
			this.removeChild(first_card);
			this.cards = this.#generate_cards();

			// Reset positions without animation
			for (const card of this.cards){
				card.style.transition = 'none';
				card.style.transform = `translateX(-${this.#offset}px)`;
			}

			this.#animating = false;
		});
	}

	#generate_cards() {
		const cards = [];
		for (const child of this.children) {
			if (child.classList.contains('btn')) continue;
			child.style.flexShrink = "0";
			cards.push(child);
		}

		return cards;
	}
}

window.customElements.define('x-carousel', Carousel);

