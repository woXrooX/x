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

}

// Make Main Usable W/O Importing It
window.Main = Main;
