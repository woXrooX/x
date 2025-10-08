export function before() { window.x.Head.set_title("home"); }

export default async function main(){
	return `
		<container class="max-width-1200px padding-5 gap-1">
			<column class="surface-v1 padding-5 gap-1">
				<p class="text-size-2">Welcome to x!</p>
				<p>New here? Start with the <a href="https://www.woxroox.com/developer/tools/x/documentation/quick_start" target="_blank">Quick Start</a>.</p>
				<p class="text-color-secondary text-size-0-9">You're on the "/home" page.</p>
			</column>
		</container>
	`;
}
