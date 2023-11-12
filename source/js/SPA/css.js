// // Get the :root styles
// const rootStyles = document.querySelector(':root');
// // Set/Update new values
// rootStyles.style.setProperty("--color-success", "hsla(211.059, 100%, 50%, 1)");

// // Compute the :root styles
// const computedRootStyles = getComputedStyle(rootStyles);
// // Get computed value
// console.log(computedRootStyles.getPropertyValue("--color-success"));


// let root = document.querySelector(':root');
// let currentColorScheme = root.getAttribute('color-scheme');
// console.log(root);
// console.log(currentColorScheme);
// console.log(getComputedStyle(document.body).getPropertyValue('--z-minus'));


// prefers-color-scheme TMP
// console.log(window.matchMedia("(prefers-color-scheme: dark)"));
// console.log(window.matchMedia("(prefers-color-scheme: dark)").matches);
// const mq = window.matchMedia("(prefers-color-scheme: dark)");
// mq.addEventListener('change', ({matches: isDark})=>{
//   console.log(matches);
//   console.log("Changed");
// });
// mq.dispatchEvent(new Event('change'));


///////////////////////////// CSS
// import styles from '../css/styles.css' assert {type: 'css'};
// console.log(styles.rules);
// styles.rules[0].style.color = "blue";
// console.log(styles.rules[0].style.color);

// background -> middleground -> foreground

"use strict";

export default class CSS{
	// Color Modes
	static colorModes = Object.freeze({DARK: 1, LIGHT: 2});

	// Color Mode Default: Dark Mode
	static currentColorMode = CSS.colorModes.DARK;

	static colorModeSwitcherIcon = null;

	//////////// APIs
	// Init
	static init(){
		Log.info("CSS.init()");

		CSS.colorModeSwitcherIcon = document.querySelector(`${Menu.selector} > header > x-icon[for=colorModeSwitcher]`);

		CSS.#loadColorBrand();
		CSS.detectColorMode();
		CSS.#onColorModeChange();
		CSS.#handleColorModeToggle();
	}

	// Get CSS value
	static getValue(variable){
		return getComputedStyle(document.querySelector(':root')).getPropertyValue(variable);
	}

	///// Load Brand Color From Configurations File
	static #loadColorBrand(){
		// Update CSS color main
		const rootStyles = document.querySelector(':root');

		rootStyles.style.setProperty("--color-main-hue", `${window.CONF.default.color.brand.hue || 230}deg`);
		rootStyles.style.setProperty("--color-main-saturation", `${window.CONF.default.color.brand.saturation || 13}%`);
		rootStyles.style.setProperty("--color-main-lightness", `${window.CONF.default.color.brand.lightness || 9}%`);
	}

	///// Color Mode
	// Detect Color Mode
	static detectColorMode(){
		Log.info("CSS.detectColorMode()");
		// Get User Preferred Color Mode
		if(
			// If User Is In Session
			"user" in window.session &&

			// If Session User Has "app_color_mode"
			"app_color_mode" in window.session["user"] &&

			// If "app_color_mode" Is In CSS.colorModes
			Object.values(CSS.colorModes).includes(window.session["user"]["app_color_mode"])

		) CSS.currentColorMode = window.session["user"]["app_color_mode"];

		// Get saved color mode to the local storage
		// NOTE: Prevents emulation of the color scheme via devtools
		else if(localStorage.getItem("x.app_color_mode")) CSS.currentColorMode = parseInt(localStorage.getItem("x.app_color_mode"));

		// Get System Color Mode
		else if(window.matchMedia){
			// System Default: Light
			if(window.matchMedia('(prefers-color-scheme: light)').matches) CSS.currentColorMode = CSS.colorModes.LIGHT;

			// System Default: Dark
			else CSS.currentColorMode = CSS.colorModes.DARK;
		}

		// Switch the color mode
		// Set color mode switcher icon "name" and "toggle" values
		switch(CSS.currentColorMode){
			case CSS.colorModes.LIGHT:
				CSS.#light();
				CSS.colorModeSwitcherIcon.name = "dark_mode";
				CSS.colorModeSwitcherIcon.toggle = "light_mode";
				break;

			// If we add more color modes we will uncommend the code below and add more cases
			// case CSS.colorModes.DARK:
			//     CSS.#dark();
			//     CSS.colorModeSwitcherIcon.name = "light_mode";
			//     CSS.colorModeSwitcherIcon.toggle = "dark_mode";
			//     break;

			default:
				CSS.#dark();
				CSS.colorModeSwitcherIcon.name = "light_mode";
				CSS.colorModeSwitcherIcon.toggle = "dark_mode";
		}
	}

	// On System Color Mode Changes - Listen To Color Mode Changes
	static #onColorModeChange(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", CSS.detectColorMode);}

	// Handles color mode switching to dark and light modes using x-icon in menu
	static #handleColorModeToggle(){
		// A Reminder to My Future Self :)
		// We do not have to apply name and toggle values like we did in CSS.detectColorMode().
		// Default toggler handles well icon changes since we are only using x-icon to toggle the color modes in this method

		CSS.colorModeSwitcherIcon.addEventListener("click", ()=>{
			switch(CSS.currentColorMode){
				case CSS.colorModes.DARK: CSS.#light(); break;
				// If we add more color modes we will uncommend the code below and add more cases
				// case CSS.colorModes.LIGHT:CSS.#dark(); break;
				default: CSS.#dark();
			}

			CSS.#saveColorMode();
		});
	}

	// Save color mode to the database or to the local storage
	static async #saveColorMode(){
		// If user is logged in, update user color mode on database
		if("user" in window.session){
			const req = await window.bridge("api", {for:"changeUserAppColorMode", colorMode: CSS.currentColorMode}, "application/json");
			// Update the session
			if("type" in req && req["type"] === "success"){
				window.session["user"]["app_color_mode"] = CSS.currentColorMode;
				localStorage.setItem('x.app_color_mode', CSS.currentColorMode);
				Log.success(`CSS.#saveColorMode(): session.user.app_color_mode = ${CSS.currentColorMode}`);
			}
		}else localStorage.setItem('x.app_color_mode', CSS.currentColorMode);
	}

	//////////// Modes
	static #dark(){
		Log.info("CSS.#dark()");

		CSS.currentColorMode = CSS.colorModes.DARK;

		document.documentElement.classList.add("dark");
		document.documentElement.classList.remove("light");
	}

	static #light(){
		Log.info("CSS.#light()");

		CSS.currentColorMode = CSS.colorModes.LIGHT;

		document.documentElement.classList.add("light");
		document.documentElement.classList.remove("dark");
	}
}

// Make CSS Usable W/O Importing It
window.CSS = CSS;
