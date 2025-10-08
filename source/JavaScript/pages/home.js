export function before() { window.x.Head.set_title("home"); }

export default async function main(){
	return `
		<container class="max-width-1200px padding-5 gap-1">
			<column class="surface-v1 padding-2 gap-1">
				<p>Welcome to x</p>
				<p>This is the default "/home" page</p>
			</column>
		</container>
	`;
}


