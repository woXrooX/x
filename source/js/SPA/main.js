export default class Main{
	static selector = "body > main";

	// As index.html Already Has body > main Element We Do Not Have To Wait For DOM Creation To Use Query Selector
	static element = Main.element = document.querySelector(Main.selector);

	static animationStart(){
		Main.element.classList.remove("show");
	}

	static animationEnd(){
		Main.element.classList.add("show");
	}

	static situational_content(type = "error", contentTitle = "ERROR", content = "ERROR", documentTitle = null){
		if(documentTitle === null) documentTitle = type.toUpperCase();

		Title.set(documentTitle);

		return `
			<container class="flex-y-center p-5">
				<column class="flex-center surface-${type} p-8 gap-2">
					<p class="d-flex flex-row flex-y-center gap-0-2 text-color-${type} text-size-2">
						<x-svg name="type_${type}" class="text-size-2-5" color="var(--color-${type})"></x-svg>
						${contentTitle}
					</p>
					<p class="text-size-1-1 text-align-center">${content}</p>
				</column>
			</container>
		`;
	}

}

// Make Main Usable W/O Importing It
window.Main = Main;
