export function before() { window.x.Head.set_title("index"); }

export default async function main(){
	return `
		<container class="padding-5 gap-1 max-width-1200px">
			<column class="surface-v1 padding-5 gap-1">
				<p class="text-size-2">Welcome to x!</p>
				<p>New here? Start with the <a href="https://www.woxroox.com/developer/tools/x/documentation/quick_start" target="_blank">Quick Start</a>.</p>
				<p class="text-color-secondary text-size-0-9">You're on the "/" page.</p>
			</column>
		</container>
	`;
}
