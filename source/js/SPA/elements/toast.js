export default class Toast extends HTMLElement{
	/////////////////////////// Static

	static #selector = "body > toasts";
	static #auto_dismiss_timer = 5000;

	/////////// APIs
	static new(type, content){
		if(!!type === false || !!content === false){
			type = "warning";
			content = "Toast: " + Lang.use("invalid_value");
		}

		document.querySelector(Toast.#selector).innerHTML += `<x-toast type="${type}">${content}</x-toast>`;

		// Auto Remove After N Seconds
		setTimeout(()=>{document.querySelector(Toast.#selector).firstChild?.remove();}, Toast.#auto_dismiss_timer);
	}

	static handle_commands(commands, response){
		if(!!commands === false) return;
		if(!!response === false) return;

		const instructions = Toast.#parse_commands(commands);

		for(const instruction of instructions)
			if(instruction["types"].includes("any") || instruction["types"].includes(response["type"]))
				return Toast.new(response["type"], response[instruction["source"]]);
	}

	/////////// Helpers
	static #parse_commands(commands){
		const instructions = [];

		commands = commands.split(' ');

		for(const command of commands){
			const parts = command.split(':');

			// Invalid command
			if(parts.length !== 3) continue;

			instructions.push({
				"types": parts[1].split('|'),
				"source": parts[2]
			});
		}

		return instructions;
	}

	/////////////////////////// Object

	constructor(){
		super();

		this.shadow = this.attachShadow({mode: 'closed'});

		Type: {
			this.type_name = "error";

			if(window.x.Notification.types.includes(this.getAttribute("type"))) this.type_name = this.getAttribute("type");
			else this.textContent = `Toast.constructor(): Invalid type "${this.getAttribute('type')}"`;
		}

		this.shadow.innerHTML += `
			<style>
				toast{
					font-size: 1rem;

					overflow: hidden;

					background-color: var(--color-main-tint-1);
					padding: var(--padding);
					margin: 0px;

					border-radius: var(--radius);
					box-shadow: var(--shadow);

					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;

					animation: fade_in var(--transition-velocity) ease;

					& > main{
						display: flex;
						flex-direction: row;
						gap: calc(var(--gap) * 0.5);
						justify-content: flex-start;
						align-items: center;

						& > toast-type-color{
							background-color: var(--color-${[this.type_name]});
							height: 1em;
							width: 5px;
							border-radius: var(--radius);
						}

						& > content{
							color: var(--color-text-secondary);
							font-size: 0.8em;
						}
					}
				}

				@keyframes fade_in{
					0%{transform:translateY(-10px);}
					100%{transform:translateY(0px);}
				}
			</style>
			<toast>
				<main>
					<toast-type-color></toast-type-color>
					<x-svg
						for="toast-type-svg"
						name="type_${this.type_name}"
						color="var(--color-${this.type_name})"
					></x-svg>
					<content>${window.Lang.use(this.textContent)}</content>
				</main>
				<x-svg name="x" for="dismiss"></x-svg>
			</toast>
		`;

		//// Remove Toast On Click Dismiss
		// dismiss.onclick = ()=> this.remove(); // Bug w/ N sec removal
		this.shadow.querySelector("toast > x-svg[for=dismiss]").onclick = ()=> this.style.display = "none";
	}
}

customElements.define('x-toast', Toast);

// Make Toast Usable W/O Importing It
window.Toast = Toast;
