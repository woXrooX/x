export default class Main{
	static selector = "body > div#root > main";

	static element = window.x.Root.element.querySelector("main");

	static animation_start(){ Main.element.classList.remove("show"); }

	static animation_end(){ Main.element.classList.add("show"); }

	static async render(DOM){
		// If passed object like: createElement("x-form")
		if(typeof DOM === "object") window.Main.element.replaceChildren(DOM);

		// If passed string like: "<x-form></x-from>"
		else if(typeof DOM === "string") window.Main.element.innerHTML = DOM;

		window.dispatchEvent(new CustomEvent("DOM_change"));
	}

	static situational_content(type = "error", content_title = "ERROR", content = "ERROR", document_title = null){
		if(document_title === null) document_title = type.toUpperCase();

		window.x.Head.set_title(document_title);

		return `
			<container class="flex-y-center padding-5">
				<column class="flex-center surface-${type} padding-8 gap-2">
					<p class="display-flex flex-row flex-y-center gap-0-2 text-color-${type} text-size-2">
						<x-svg name="type_${type}" class="text-size-2-5" color="var(--color-${type})"></x-svg>
						${content_title}
					</p>
					<p class="text-size-1-1 text-align-center">${content}</p>
				</column>
			</container>
		`;
	}

}

window.Main = Main;
