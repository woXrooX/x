export default class Share extends HTMLElement{
	#native_data = {};
	#encoded_data = {};

	constructor() {
		super();

		this.innerHTML = `<x-svg name="upload_v2" id="modal_x_share"></x-svg>`;

		this.querySelector("x-svg#modal_x_share").addEventListener("click", async (event)=>{
			event.preventDefault();

			this.#construct_data();
			await this.#native_UI();
			this.#custom_UI();
		});
	}

	#construct_data() {
		this.#native_data = {
			title: document.querySelector('meta[property="og:title"]')?.getAttribute("content") || document.title,
			text:
				document.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
				document.querySelector('meta[name="description"]')?.getAttribute("content") ||
				'',

			url: document.querySelector('meta[property="og:url"]')?.getAttribute("content") || window.location.href
		};

		this.#encoded_data = {
			title: encodeURIComponent(this.#native_data.title),
			text: encodeURIComponent(this.#native_data.text),
			url: encodeURIComponent(this.#native_data.url)
		};
	}

	async #native_UI() {
		if (!navigator.share) return;

		try { await navigator.share(this.#native_data); }
		catch(err) { window.Log.error(`x-share error: ${err}`); }
	}

	#custom_UI() {
		if (navigator.share) return;

		// Capture the component instance
		const self = this;

		Modal.push_func(async function x_share_copy_to_clipboard() {
			const copy_button = Modal.element_main.querySelector("#x_share_copy_link");
			if (!copy_button) return;

			copy_button.addEventListener("click", async (e)=>{
				e.preventDefault();

				try {
					await navigator.clipboard.writeText(self.#native_data.url);
					x.Toast.new('success', 'Link copied!');
				}

				catch(err) { x.Toast.new('error', 'Copy failed: ' + err); }
			}, { once: true });
		});

		const modal_DOM = `
			<row class="flex-row flex-x-between padding-2 gap-1 text-size-2">
				<a href="https://x.com/intent/tweet?text=${this.#encoded_data.text}&url=${this.#encoded_data.url}" target="_blank" rel="noopener noreferrer">
					<x-svg name="x_original"></x-svg>
				</a>

				<a href="https://www.linkedin.com/sharing/share-offsite/?url=${this.#encoded_data.url}" target="_blank" rel="noopener noreferrer">
					<x-svg name="linkedin_original"></x-svg>
				</a>

				<a href="https://www.facebook.com/sharer/sharer.php?u=${this.#encoded_data.url}" target="_blank" rel="noopener noreferrer">
					<x-svg name="facebook_original"></x-svg>
				</a>

				<a href="https://www.reddit.com/submit?url=${this.#encoded_data.url}&title=${this.#encoded_data.title}" target="_blank" rel="noopener noreferrer">
					<x-svg name="reddit_original"></x-svg>
				</a>

				<a href="https://t.me/share/url?url=${this.#encoded_data.url}&text=${this.#encoded_data.text}" target="_blank" rel="noopener noreferrer">
					<x-svg name="telegram_original"></x-svg>
				</a>

				<a href="#" id="x_share_copy_link">
					<x-svg name="link"></x-svg>
				</a>
			</row>
		`;

		Modal.show(modal_DOM, "x_share_copy_to_clipboard");
	}
};

window.customElements.define('x-share', Share);
