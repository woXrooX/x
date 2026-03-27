export function before(){
	window.x.Head.set_title("cancelled");
}

export default function main(){
	return `
		<container class="gap-5 max-width-1200px">
			<section class="width-100 height-100 display-grid place-items-center bg-warning font-family-Poppins">
				<p class="grid-area-1-slash-1 text-size-10 text-color-hsla-0-0-100-0-3">${window.Lang.use("cancelled")}</p>
				<p class="grid-area-1-slash-1 text-size-2 text-color-white">${window.Lang.use("payment_cancelled")}</p>
			</section>
		</container>
	`;
}
