"use strict";

export default class Language extends HTMLElement{
	static #FALLBACK = "en";
	static #CURRENT = "en";
	static DICT = {};

	static init(){
		Language.#FALLBACK = window.CONF.default.language.fallback;

		Language.#detectCurrentCode();
	}

	//////// APIs
	// Can be used for translations and just for normal use cases
	static translate(keyword, code = Language.#CURRENT){
		// Check if valid keyword was passed
		if(!!keyword === false) keyword = "invalidKeyword";

		// Check if keyword is in Lang.DICT
		if(!(keyword in Language.DICT)) return keyword;

		// Check if code is in the list of supported langauges else set code it to fallback language
		if(!window.CONF.default.language.supported.includes(code)) code = Language.#FALLBACK;

		// In case FALLBACK language code also not in the DICT[keyword]
		// then grab the first translation
		if(!(code in Language.DICT[keyword])){
			if(Object.entries(Lang.DICT[keyword])[0] === undefined) return "emptyLanguage";
			else return Object.entries(Lang.DICT[keyword])[0][1];
		}

		// Finally
		return Language.DICT[keyword][code];
	}

	// Just returns translation for the "keyword"
	static use(keyword){return Language.translate(keyword);}

	//////// Helpers
	static codeToFlag(code){
		switch(code){
			case "en": return "🇬🇧";
			case "uz": return "🇺🇿";
			case "ru": return "🇷🇺";
			default: return "🏴‍☠️";
		}
	}

	//////// Methods
	static async switchTo(code = Language.#FALLBACK){
		// Check if supported language was passed
		if(!window.CONF.default.language.supported.includes(code)) return;

		if("user" in window.session) await window.bridge("/api", {for:"changeUserAppLanguage", "code": code}, "application/json");
		else localStorage.setItem('x.language', code);

		// Update current language code
		Language.#CURRENT = code;

		// Update the DOM
		window.dispatchEvent(new CustomEvent("domChange", {detail: ["all"]}));
	}

	static #detectCurrentCode(){
		if("user" in window.session) Language.#CURRENT = window.session["user"].app_language;

		else if(localStorage.getItem("x.language")) Language.#CURRENT = localStorage.getItem("x.language");

		else Language.#CURRENT = Language.#FALLBACK;
	}
}

// Lang is alias to Language
window.Lang = Language;

window.Language = Language;
