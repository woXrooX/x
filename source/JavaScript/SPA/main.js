export default class Main{
	static selector = "body > div#root > main";

	// As index.html Already Has body > main Element We Do Not Have To Wait For DOM Creation To Use Query Selector
	static element = window.x["Root"].element.querySelector("main");

	static animation_start(){ Main.element.classList.remove("show"); }

	static animation_end(){ Main.element.classList.add("show"); }

	static situational_content(type = "error", content_title = "ERROR", content = "ERROR", document_title = null){
		if(document_title === null) document_title = type.toUpperCase();

		Title.set(document_title);

		return `
			<container class="flex-y-center padding-5">
				<column class="flex-center surface-${type}padding-8 gap-2">
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

// Make Main Usable W/O Importing It
window.Main = Main;
