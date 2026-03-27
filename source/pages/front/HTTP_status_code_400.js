export function before(){
	window.x.Head.set_title("400");
}

export default function main(){
	return `
		<container class="flex-center padding-5 bg-error font-family-Poppins">
			<section class="display-grid place-items-center">
				<p class="grid-area-1-slash-1 text-size-15 text-color-hsla-0-0-100-0-3">400</p>
				<p class="grid-area-1-slash-1 text-size-3 text-color-white">${window.Lang.use("bad_request")}</p>
			</section>

			<p class="text-align-center text-size-0-9 text-color-hsla-0-0-100-0-7">
				We couldn't process that request.
				The link might be incomplete, contain a typo, or include information we don't recognize.
				Double-check the URL and try again, or head back to our <a href="/" class="text-color-white text-decoration-underline">home</a> page to keep exploring.
			</p>
		</container>
	`;
}
