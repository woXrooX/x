export default class Modal extends HTMLElement{
	/////////////////////////// Static

	static #selector = "body > modal";
	static #element = null;
	static element_main = null;
	static #shown = false;
	static #locked = false;
	static #FUNC_POOL = {};

	static {
		Modal.#element = document.querySelector(Modal.#selector);
		Modal.element_main = Modal.#element.querySelector("main");

		// Hide on click close button
		Modal.#element.querySelector("x-svg[for=modal_close]").onclick = Modal.hide;

		// Close on click the cover
		Cover.onClickExecute(Modal.hide);

		// Close on "Escape" press
		document.addEventListener('keydown', ()=>{if(event.key === "Escape") Modal.hide();});
	}

	/////////// APIs
	static push_func(func){ Modal.#FUNC_POOL[func.name] = func; }

	static hide(){
		if(Modal.#shown === false) return;
		if(Modal.#locked === true) return Modal.flash();

		Modal.#shown = false;

		Modal.#element.classList.remove("show");

		Modal.#element.ontransitionend = ()=>{
			Modal.element_main.replaceChildren();
			Modal.#element.ontransitionend = null;
		};

		Cover.hide();
	}

	static show(DOM, func_name = null, data = null){
		if(Modal.#shown === true) return;

		Modal.#shown = true;

		Modal.#element.classList.add("show");
		Modal.element_main.innerHTML = DOM;
		Modal.#execute_on_show(func_name, data);

		Cover.show();
	}

	static lock(){ Modal.#locked = true; }

	static unlock(){ Modal.#locked = false; }

	static flash(type = "error"){
		Modal.#element.style = `border: 2px solid ${window.x.CSS.get_value("--color-"+type)};`;
		setTimeout(()=>{Modal.#element.removeAttribute("style");}, 1000);
	}

	static handle_commands(commands, type){
		if(!!commands === false) return;
		if(!!type === false) return;

		const instructions = Modal.#parse_commands(commands);

		for(const instruction of instructions){
			if(instruction["types"].includes("any") || instruction["types"].includes(type)){
				Modal.#handle_command_action(instruction["action"]);
				break;
			}
		}
	}

	/////////// Helpers
	static async #execute_on_show(func_name, data = null){
		if(!!func_name === false) return;
		await Modal.#FUNC_POOL[func_name](data);
	}

	static #parse_commands(commands){
		const instructions = [];

		commands = commands.split(' ');

		for(const command of commands){
			const parts = command.split(':');

			// Invalid command
			if(parts.length !== 3) continue;

			instructions.push({
				"types": parts[1].split('|'),
				"action": parts[2]
			});
		}

		return instructions;
	}

	static #handle_command_action(command){
		switch(command){
			case "hide":
				Modal.hide();
				break;

			default:
				Log.warning("Modal.handle_commands(): Invalid action");
				break;
		}
	}

	/////////////////////////// Object

	#DOM = null;

	constructor(){
		super();
		this.shadow = this.attachShadow({mode: 'closed'});
		this.#DOM = this.innerHTML;
		this.replaceChildren();

		CSS: {
			const style = document.createElement('style');
			style.textContent = `:host {display: none;}`;
			this.shadow.appendChild(style);
		}

		this.#handle_trigger();
	}

	#handle_trigger = ()=>{
		switch (this.getAttribute("trigger_type")){
			case "click":
				this.#handle_trigger_click();
				break;

			case "hover":
				this.#handle_trigger_hover();
				break;

			case "auto":
				this.#handle_trigger_auto();
				break;

			default:
				this.#handle_trigger_click();
				break;
		}
	};

	#handle_trigger_click = ()=>{
		const trigger_elements = document.querySelectorAll(this.getAttribute("trigger_selector"));
		if(!!trigger_elements === false) return;

		for(const element of trigger_elements){
			element.style.cursor = "pointer";
			element.onclick = ()=> Modal.show(this.#DOM, this.getAttribute("modal_func"), this.getAttribute("modal_data"));
		}
	};

	#handle_trigger_hover = ()=>{
	};

	#handle_trigger_auto = ()=>{
	};
};

window.customElements.define('x-modal', Modal);

// Make Modal Usable W/O Importing It
window.Modal = Modal;
