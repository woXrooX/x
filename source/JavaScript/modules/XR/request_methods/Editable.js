export default class Editable {
	/////////////////////////// Object

	#data;
	#response;
	#element = null;
	#old_text_content;
	#updated_text_content;
	#in_progress = false;

	constructor(element){
		this.#element = element;
		this.#old_text_content = this.#element.textContent.trim();
		this.#updated_text_content = this.#old_text_content;

		this.#on_click();
	}


	/////////// Helpers
	#on_click(){ this.#element.onclick = ()=>{ this.#editing_view(); }; }

	#request_to_back_end = async ()=>{
		if (this.#in_progress) return;
		this.#in_progress = true;

		this.#progress_view();

		this.#construct_data();

		try {
			this.#response = await window.x.Request.make(this.#data, this.#element.getAttribute("XR-editable"));

			if (!("type" in this.#response)) return this.#set_state_indicator("error");

			if (this.#response["type"] === "success") this.#old_text_content = this.#updated_text_content;

			this.#set_state_indicator(this.#response["type"]);

			setTimeout(()=>{ this.#set_state_indicator(null); }, 2000);

			window.x.XR.execute_on_response(this.#element.getAttribute("XR-func"), this.#response, this.#element);

			x.Toast.handle_commands(this.#element.getAttribute("x-toast"), this.#response);

			window.x.Response.handle_actions(this.#response);
		}

		catch (error) {
			this.#set_state_indicator("error");
			return;
		}

		finally {
			this.#in_progress = false;
		}
	};

	#construct_data() {
		try {
			this.#data = JSON.parse(this.#element.getAttribute("XR-data")) || {};
			this.#data["value"] = this.#updated_text_content;
		}

		catch(error) { this.#data = {}; }

		this.#data = {
			...(this.#element.hasAttribute("XR-for") ? {"for": this.#element.getAttribute("XR-for")} : {}),
			...this.#data
		}
	}

	#set_state_indicator = (state)=>{
		if (state === null) this.#element.removeAttribute("XR-state");
		else this.#element.setAttribute("XR-state", state);
	};


	/////////// Views

	#original_view = ()=>{
		this.#element.textContent = this.#updated_text_content;
		this.#element.removeAttribute("contenteditable");
		this.#set_state_indicator(null);
	};

	#editing_view = ()=>{
		//  Check if it is already focused
		if (this.#element == document.activeElement) return;

		this.#element.setAttribute("contenteditable", "plaintext-only");
		this.#set_state_indicator("editing");
		this.#element.focus();

		const on_blur = () => {
			this.#element.removeEventListener("blur", on_blur);
			this.#element.removeEventListener("keydown", on_key);

			this.#updated_text_content = this.#element.textContent.trim();

			if (this.#updated_text_content === this.#old_text_content) this.#original_view();
			else this.#request_to_back_end();
		};

		const on_key = (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				this.#element.removeEventListener("blur", on_blur);
				this.#original_view();
			}

			if (event.key === "Enter") {
				event.preventDefault();

				// If only enter is pressed
				if (!event.ctrlKey) return on_blur();

				// If Linux/Windows CTRL or MacOS control key is pressed, then add new line
				const cursor_location = window.getSelection().getRangeAt(0);
				const newline = document.createTextNode("\n");
				cursor_location.insertNode(newline);
				cursor_location.setStartAfter(newline);
			}
		};

		this.#element.addEventListener("blur", on_blur);
		this.#element.addEventListener("keydown", on_key);
	};

	#progress_view = ()=>{
		this.#element.textContent = this.#updated_text_content;
		this.#element.removeAttribute("contenteditable");
		this.#set_state_indicator("in_progress");
	};
}
