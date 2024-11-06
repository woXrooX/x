// // Get the :root styles
// const root_styles = document.querySelector(':root');
// // Set/Update new values
// root_styles.style.setProperty("--color-success", "hsla(211.059, 100%, 50%, 1)");

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

// OG
// import CSS from "./css.js";
// document.head.innerHTML += `<style>${CSS}</style>`;

///////////////////////////// CSS
// import styles from '../css/styles.css' assert {type: 'css'};
// console.log(styles.rules);
// styles.rules[0].style.color = "blue";
// console.log(styles.rules[0].style.color);

// background -> middleground -> foreground

"use strict";

export default class CSS{
	// Color Modes
	static color_modes = Object.freeze({DARK: 1, LIGHT: 2});

	// Color Mode Default: Dark Mode
	static current_color_mode = CSS.color_modes.DARK;

	static color_mode_switcher_icon = null;

	//////////// APIs
	// Init
	static init(){
		Log.info("CSS.init()");

		CSS.color_mode_switcher_icon = document.querySelector(`${Menu.selector} > header > x-svg[for=color_mode_switcher]`);

		CSS.#load_color_brand();
		CSS.detect_color_mode();
		CSS.#on_color_mode_change();
		CSS.#handle_color_mode_toggle();
	}

	// Get CSS value
	static get_value(variable){ return getComputedStyle(document.querySelector(':root')).getPropertyValue(variable); }

	///// Load Brand Color From Configurations File
	static #load_color_brand(){
		// Update CSS color main
		const root_styles = document.querySelector(':root');

		root_styles.style.setProperty("--color-main-hue", `${window.CONF.default.color.brand.hue || 230}deg`);
		root_styles.style.setProperty("--color-main-saturation", `${window.CONF.default.color.brand.saturation || 13}%`);
		root_styles.style.setProperty("--color-main-lightness", `${window.CONF.default.color.brand.lightness || 9}%`);
	}

	///// Color Mode
	// Detect Color Mode
	static detect_color_mode(){
		Log.info("CSS.detect_color_mode()");

		// Get User Preferred Color Mode
		if(
			// If User Is In Session
			"user" in window.session &&

			// If Session User Has "app_color_mode"
			"app_color_mode" in window.session["user"] &&

			// If "app_color_mode" Is In CSS.color_modes
			Object.values(CSS.color_modes).includes(window.session["user"]["app_color_mode"])

		) CSS.current_color_mode = window.session["user"]["app_color_mode"];

		// Get saved color mode to the local storage
		// NOTE: Prevents emulation of the color scheme via devtools
		else if(localStorage.getItem("x.color_mode")) CSS.current_color_mode = parseInt(localStorage.getItem("x.color_mode"));

		// Get System Color Mode
		else if(window.matchMedia){
			// System Default: Light
			if(window.matchMedia('(prefers-color-scheme: light)').matches) CSS.current_color_mode = CSS.color_modes.LIGHT;

			// System Default: Dark
			else CSS.current_color_mode = CSS.color_modes.DARK;
		}

		// Switch the color mode
		// Set color mode switcher icon "name" and "toggle" values
		switch(CSS.current_color_mode){
			case CSS.color_modes.LIGHT:
				CSS.#light();

				if(!!CSS.color_mode_switcher_icon === false) break;
				CSS.color_mode_switcher_icon.name = "dark_mode";
				CSS.color_mode_switcher_icon.toggle = "light_mode";
				break;

			// If we add more color modes we will uncommend the code below and add more cases
			// case CSS.color_modes.DARK:
			//     CSS.#dark();
			//     CSS.color_mode_switcher_icon.name = "light_mode";
			//     CSS.color_mode_switcher_icon.toggle = "dark_mode";
			//     break;

			default:
				CSS.#dark();

				if(!!CSS.color_mode_switcher_icon === false) break;
				CSS.color_mode_switcher_icon.name = "light_mode";
				CSS.color_mode_switcher_icon.toggle = "dark_mode";
		}
	}

	// On System Color Mode Changes - Listen To Color Mode Changes
	static #on_color_mode_change(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", CSS.detect_color_mode);}

	// Handles color mode switching to dark and light modes using x-svg in menu
	static #handle_color_mode_toggle(){
		// A Reminder to My Future Self :)
		// We do not have to apply name and toggle values like we did in CSS.detect_color_mode().
		// Default toggler handles well icon changes since we are only using x-svg to toggle the color modes in this method

		if(!!CSS.color_mode_switcher_icon === false) return;

		CSS.color_mode_switcher_icon.addEventListener("click", ()=>{
			switch(CSS.current_color_mode){
				case CSS.color_modes.DARK: CSS.#light(); break;
				// If we add more color modes we will uncommend the code below and add more cases
				// case CSS.color_modes.LIGHT:CSS.#dark(); break;
				default: CSS.#dark();
			}

			CSS.#save_color_mode();
		});
	}

	// Save color mode to the database or to the local storage
	static async #save_color_mode(){
		// If user is logged in, update user color mode on database
		if("user" in window.session){
			const req = await window.bridge({for: "change_user_app_color_mode", color_mode: CSS.current_color_mode}, "/api", "application/json");
			// Update the session
			if("type" in req && req["type"] === "success"){
				window.session["user"]["app_color_mode"] = CSS.current_color_mode;
				localStorage.setItem('x.color_mode', CSS.current_color_mode);
				Log.success(`CSS.#save_color_mode(): session.user.app_color_mode = ${CSS.current_color_mode}`);
			}
		}else localStorage.setItem('x.color_mode', CSS.current_color_mode);
	}

	//////////// Modes
	static #dark(){
		Log.info("CSS.#dark()");

		CSS.current_color_mode = CSS.color_modes.DARK;

		document.documentElement.classList.add("dark");
		document.documentElement.classList.remove("light");
	}

	static #light(){
		Log.info("CSS.#light()");

		CSS.current_color_mode = CSS.color_modes.LIGHT;

		document.documentElement.classList.add("light");
		document.documentElement.classList.remove("dark");
	}
}

// Make CSS Usable W/O Importing It
window.x["CSS"] = CSS;
