export const TITLE = 404;

export default function main(){
	return `
		<container class="padding-5">
			<column class="width-50 surface-error padding-3 gap-0-5">
				<h1>404</h1>
				<h3 class="text-color-secondary">${window.Lang.use("not_found")}</h3>
			</column>
		</container>
	`;
}
