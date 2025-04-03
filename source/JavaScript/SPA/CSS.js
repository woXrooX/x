// // Get the :root styles
// const root_styles = document.querySelector(':root');
// // Set/Update new values
// root_styles.style.setProperty("--color-success", "hsla(211.059, 100%, 50%, 1)");

// let root = document.querySelector(':root');
// let currentColorScheme = root.getAttribute('color-scheme');
// console.log(root);
// console.log(currentColorScheme);


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
// import CSS from "./CSS.js";
// document.head.innerHTML += `<style>${CSS}</style>`;

///////////////////////////// CSS
// import styles from '../CSS/styles.css' assert {type: 'css'};
// console.log(styles.rules);
// styles.rules[0].style.color = "blue";
// console.log(styles.rules[0].style.color);

// background -> middleground -> foreground

export default class CSS{
	// Color modes
	static color_modes = Object.freeze({DARK: 1, LIGHT: 2});

	// Default color mode: Dark
	static current_color_mode = CSS.color_modes.DARK;

	static color_mode_switcher_icon = null;



	//////////////////////// APIs
	// Init
	static init(){
		Log.info("CSS.init()");

		CSS.color_mode_switcher_icon = document.querySelector(`${Menu.selector} > header > x-svg[for=color_mode_switcher]`);

		CSS.detect_color_mode();
		CSS.#on_color_mode_change();
		CSS.#handle_color_mode_toggle();
	}

	// Get CSS value
	static get_value(variable){ return getComputedStyle(document.querySelector(':root')).getPropertyValue(variable); }

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



	//////////////////////// Helpers

	// On system color mode changes - listen to color mode changes
	static #on_color_mode_change(){
		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", CSS.detect_color_mode);
	}

	// Handles color mode switching to dark and light modes using x-svg[for=color_mode_switcher] in menu
	static #handle_color_mode_toggle(){
		if (!!CSS.color_mode_switcher_icon === false) return;

		CSS.color_mode_switcher_icon.addEventListener("click", ()=>{
			switch(CSS.current_color_mode){
				case CSS.color_modes.DARK:
					CSS.#light();
					break;

				case CSS.color_modes.LIGHT:
					CSS.#dark();
					break;

				default:
					CSS.#dark();
			}

			CSS.#save_color_mode();
		});
	}

	// Save color mode to the database or to the local storage
	static async #save_color_mode(){
		// If user is logged in, update user color mode on database
		if ("user" in window.session){
			const data = await window.bridge({for: "change_user_app_color_mode", color_mode: CSS.current_color_mode}, "/API");

			// Update the session
			if("type" in data && data["type"] === "success"){
				window.session["user"]["app_color_mode"] = CSS.current_color_mode;
				localStorage.setItem('x.color_mode', CSS.current_color_mode);
				Log.success(`CSS.#save_color_mode(): session.user.app_color_mode = ${CSS.current_color_mode}`);
			}

		}

		else localStorage.setItem('x.color_mode', CSS.current_color_mode);
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

window.x["CSS"] = CSS;
