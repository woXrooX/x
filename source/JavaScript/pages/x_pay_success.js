export function before(){
	window.x.Head.set_title("success");
}

export default function main(){
	return `
		<container>
			<section class="width-100 height-100 display-grid place-items-center bg-success font-family-Poppins">
				<h1 class="grid-area-1-slash-1 text-size-20 text-color-hsla-0-0-100-0-3">${window.Lang.use("success")}</h1>
				<h3 class="grid-area-1-slash-1 text-size-5 text-color-white">${window.Lang.use("payment_was_successful")}</h3>
			</section>
		</container>
	`;
}
