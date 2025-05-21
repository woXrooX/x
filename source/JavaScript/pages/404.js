export function before(){
	window.x.Head.set_title("404");
}

export default function main(){
	return `
		<container>
			<section class="width-100 height-100 display-grid place-items-center bg-error font-family-Poppins">
				<p class="grid-area-1-slash-1 text-size-10 text-color-hsla-0-0-100-0-3">404</p>
				<p class="grid-area-1-slash-1 text-size-2 text-color-white">${window.Lang.use("not_found")}</p>
			</section>
		</container>
	`;
}
