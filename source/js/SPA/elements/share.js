"use strict";

export default class Share extends HTMLElement{
	constructor(){
		super();

		this.textToShare = null;
		if(!!this.getAttribute("selector") === true) this.textToShare = this.getAttribute("selector");
		else if(!!this.getAttribute("text") === true) this.textToShare = this.getAttribute("text");

		const shareData = {
			title: encodeURIComponent(this.getAttribute("title") || document.title),
			text: encodeURIComponent(this.textToShare || window.Lang.use("shareDefaultText")),

			// If Share URL Is Not HTTPS It Won't Work
			// On Facebook
			// On Linkedin
			url: encodeURIComponent(this.getAttribute("url") || window.location.href)
		};


		this.innerHTML = `
			<x-modal type="icon" value="share">
				<row class="p-1 gap-0-5">
					<a href="https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.text}" target="_blank">
						<x-icon name="twitter_bird_original"></x-icon>
					</a>

					<a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}&title=${shareData.title}&summary=${shareData.text}&source=${shareData.url}" target="_blank">
						<x-icon name="linkedin_original"></x-icon>
					</a>

					<a href="https://www.facebook.com/sharer.php?u=${shareData.url}&quote=${shareData.text}" target="_blank">
						<x-icon name="facebook_original"></x-icon>
					</a>

					<a href="https://www.instagram.com/share?url=${shareData.url}&caption=${shareData.text}" target="_blank">
						<x-icon name="instagram_original"></x-icon>
					</a>

					<a href="https://t.me/share/url?url=${shareData.url}&text=${shareData.text}" target="_blank">
						<x-icon name="telegram_original"></x-icon>
					</a>

					<a href="https://www.reddit.com/submit?selftext=${shareData.text}&title=${shareData.title}&url=${shareData.url}" target="_blank">
						<x-icon name="reddit_original"></x-icon>
					</a>
				</row>
			</x-modal>
		`;

		this.querySelector("x-modal").onclick = async ()=>{

			// Check If navigator.share
			if(!!navigator.share === true)
				try{
					await navigator.share(shareData);
					window.Log.success("MDN shared successfully");
				}catch(err){
					window.Log.error(`Error: ${err}`);
				}

			else window.Log.warning("No Native Support For 'navigator.share' On Your Device!");
		};
	}
};

window.customElements.define('x-share', Share);

// Make Share Usable W/O Importing It
window.Share = Share;
