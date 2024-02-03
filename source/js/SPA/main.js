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

	static situationalContent(type = "error", contentTitle = "ERROR", content = "ERROR", documentTitle = null){
		if(documentTitle === null) documentTitle = type.toUpperCase();

		let icons = {
			"success": "done_circle",
			"info": "info_circle",
			"warning": "warning_triangle",
			"error": "error_hexagon"
		}

		Title.set(documentTitle);

		return `
			<container class="flex-y-center p-5">
				<column class="flex-y-center surface-${type} p-8 gap-2">
					<p class="d-flex flex-row flex-y-center gap-0-2 text-color-${type} text-size-2">
						<x-svg name="${icons[type]}" class="text-size-2-5" color="var(--color-${type})"></x-svg>
						${contentTitle}
					</p>
					<p class="text-size-1-1">${content}</p>
				</column>
			</container>
		`;
	}

}

// Make Main Usable W/O Importing It
window.Main = Main;
