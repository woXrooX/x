export default class Share extends HTMLElement{
	constructor(){
		super();

		const data = {
			title: encodeURIComponent(document.title),
			content: encodeURIComponent(document.querySelector('meta[name="description"]')?.getAttribute('content') || ''),

			// If Share URL is not HTTPS it won't work on: Facebook, Linkedin
			URL: encodeURIComponent(window.location.href)
		};

		this.innerHTML = `
			<x-svg name="upload" id="modal_x_share"></x-svg>
			<x-modal trigger_selector="x-svg#modal_x_share">
				<row class="flex-row flex-x-between padding-2 gap-1 text-size-2">
					<a href="https://x.com/intent/tweet?url=${data.URL}&text=${data.content}" target="_blank">
						<x-svg name="x_original"></x-svg>
					</a>

					<a href="https://www.linkedin.com/sharing/share-offsite/?url=${data.URL}&title=${data.title}&summary=${data.content}&source=${data.URL}" target="_blank">
						<x-svg name="linkedin_original"></x-svg>
					</a>

					<a href="https://www.facebook.com/sharer.php?u=${data.URL}&quote=${data.content}" target="_blank">
						<x-svg name="facebook_original"></x-svg>
					</a>

					<a href="https://www.reddit.com/submit?selftext=${data.content}&title=${data.title}&url=${data.URL}" target="_blank">
						<x-svg name="reddit_original"></x-svg>
					</a>

					<a href="https://t.me/share/url?url=${data.URL}&text=${data.content}" target="_blank">
						<x-svg name="telegram_original"></x-svg>
					</a>

					<a>
						<x-svg
							name="link"
							onclick="
								try {
									navigator.clipboard.writeText(window.location.href);
									x.Toast.new('success', 'Link copied!');
								}

								catch(err) { x.Toast.new('error', 'Copy failed: ' + err); }
							"
						></x-svg>
					</a>
				</row>
			</x-modal>
		`;

		this.querySelector("x-modal").onclick = async ()=>{
			if(!!navigator.share === true)
				try{ await navigator.share(data); }
				catch(err){ window.Log.error(`x-share error: ${err}`); }

			else window.Log.warning("No native support for 'navigator.share' on this device!");
		};
	}
};

window.customElements.define('x-share', Share);
