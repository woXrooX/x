export function before(){
	window.x.Head.set_title("404");
}

export default function main(){
	return `
		<container class="flex-center padding-5 bg-error font-family-Poppins">
			<section class="display-grid place-items-center">
				<p class="grid-area-1-slash-1 text-size-15 text-color-hsla-0-0-100-0-3">404</p>
				<p class="grid-area-1-slash-1 text-size-3 text-color-white">${window.Lang.use("not_found")}</p>
			</section>

			<p class="text-align-center text-size-0-9 text-color-hsla-0-0-100-0-7">
				The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
				Double-check the URL, or head back to our <a href="/" class="text-color-white text-decoration-underline">home</a> page and continue exploring.
			</p>
		</container>
	`;
}
