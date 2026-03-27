export function before(){
	window.x.Head.set_title("403");
}

export default function main(){
	return `
		<container class="flex-center padding-5 bg-error font-family-Poppins">
			<section class="display-grid place-items-center">
				<p class="grid-area-1-slash-1 text-size-15 text-color-hsla-0-0-100-0-3">403</p>
				<p class="grid-area-1-slash-1 text-size-3 text-color-white">${window.Lang.use("forbidden")}</p>
			</section>

			<p class="text-align-center text-size-0-9 text-color-hsla-0-0-100-0-7">
				It looks like you don't have permission to view this page.
				Feel free to return to the <a href="/" class="text-color-white text-decoration-underline">home</a> page, or contact us if you believe this is a mistake.
			</p>
		</container>
	`;
}
