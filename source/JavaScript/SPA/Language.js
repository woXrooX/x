export default class Language extends HTMLElement{
	static #FALLBACK = "en";
	static #CURRENT = "en";
	static DICTIONARY = {};

	static init(){
		Language.#FALLBACK = window.CONF.default.language.fallback;

		Language.#detect_current_code();
	}

	//////// APIs
	// Can be used for translations and just for normal use cases
	static translate(keyword, code = Language.#CURRENT){
		// Check if valid keyword was passed
		if(!!keyword === false) keyword = "invalid_keyword";

		// Check if keyword is in Lang.DICTIONARY
		if(!(keyword in Language.DICTIONARY)) return keyword;

		// Check if code is in the list of supported langauges else set code it to fallback language
		if(!window.CONF.default.language.supported.includes(code)) code = Language.#FALLBACK;

		// In case FALLBACK language code also not in the DICTIONARY[keyword]
		// then grab the first translation
		if(!(code in Language.DICTIONARY[keyword])){
			if(Object.entries(Lang.DICTIONARY[keyword])[0] === undefined) return "emptyLanguage";
			else return Object.entries(Lang.DICTIONARY[keyword])[0][1];
		}

		// Finally
		return Language.DICTIONARY[keyword][code];
	}

	static use(keyword){return Language.translate(keyword);}

	static async switch_to(code = Language.#FALLBACK){
		// Check if supported language was passed
		if(!window.CONF.default.language.supported.includes(code)) return;

		if("user" in window.session) await window.x.Request.make({for:"change_user_app_language", "code": code}, "/API", "application/json");
		else localStorage.setItem('x.language', code);

		// Update current language code
		Language.#CURRENT = code;

		// Update the DOM
		window.dispatchEvent(new CustomEvent("DOM_change", {detail: ["all"]}));
	}

	static code_to_flag(code){
		if(!!code === false) code = Language.#FALLBACK;

		if(code == "en") code = "gb";

		return `<img src="/images/SVG/flags/4x3/${code}.svg" style="width: 1em;">`;
	}

	static build_switcher_modal_HTML(){
		Modal.push_func(function change_language(){
			const buttons = document.body.querySelectorAll("modal > main > column > button");

			for(const button of buttons) button.onclick = ()=>{
				Lang.switch_to(button.name);
				Modal.hide();
			}
		});

		return `
			<span id="header_language_modal">${Lang.code_to_flag(Lang.CURRENT)}</span>
			<x-modal trigger_selector="span#header_language_modal" modal_func="change_language">
				<column class="padding-2 gap-1">${build_buttons_HTML()}</column>
			</x-modal>
		`;

		function build_buttons_HTML(){
			let HTML = '';

			for(const code of window.CONF.default.language.supported) HTML += `
				<button name="${code}" class="btn btn-primary display-flex flex-row gap-1 flex-x-between ${Lang.CURRENT == code ? '' : "btn-outline"} width-100">
					<span class="text-color-white">${Lang.use(code)}</span>
					<span>${Lang.code_to_flag(code)}</span>
				</button>
			`;

			return HTML;
		}
	}

	//////// Getters

	static get CURRENT(){return Language.#CURRENT;}

	//////// Helpers

	static #detect_current_code(){
		if("user" in window.session) Language.#CURRENT = window.session["user"].app_language;

		else if(localStorage.getItem("x.language")) Language.#CURRENT = localStorage.getItem("x.language");

		else Language.#CURRENT = Language.#FALLBACK;
	}
}

// Lang is alias to Language
window.Lang = Language;

window.Language = Language;
