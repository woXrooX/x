export const TITLE = 400;

export default function main(){
	return `
		<container>
			<section class="width-100 height-100 display-grid place-items-center bg-error font-family-Poppins">
				<h1 class="grid-area-1-slash-1 text-size-20 text-color-hsla-0-0-100-0-3">400</h1>
				<h3 class="grid-area-1-slash-1 text-size-5 text-color-white">${window.Lang.use("bad_request")}</h3>
			</section>
		</container>
	`;
}
