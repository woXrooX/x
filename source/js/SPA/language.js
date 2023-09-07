"use strict";

export default class Language extends HTMLElement{
  static #FALLBACK = "en";
  static #CURRENT = "en";
  static DICT = {};

  static init(){
    Language.#FALLBACK = window.CONF.default.language.fallback;

    Language.#identifyCurrentCode();
  }

  //////// APIs
  // Can Be Used For Translations And Just For Normal Use Cases
  static translate(keyword, code = Language.#CURRENT){
    // Check if valid keyword was passed
    if(!!keyword === false || keyword === '') keyword = "invalidKeyword";

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

  // Just Returns Text For The "keyword"
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
  static async #switchTo(code = Language.#FALLBACK){
    // Check if supported language was passed
    if(!window.CONF.default.language.supported.includes(code)) return;

    if("user" in window.session)
      await window.bridge("API", {for:"changeUserAppLanguage", code: code}, "application/json");

    else localStorage.setItem('x.app_language', code);

    // Update current language code
    Language.#CURRENT = code;

    // Update the DOM
    window.dispatchEvent(new CustomEvent("domChange", {detail: ["all"]}));
  }

  static #identifyCurrentCode(){
    if("user" in window.session)
      Language.#CURRENT = window.session["user"].app_language;

    else if(localStorage.getItem("x.app_language"))
      Language.#CURRENT = localStorage.getItem("x.app_language");

    else Language.#CURRENT = Language.#FALLBACK;
  }

  /////////////////////////////////////////////////// Web Componen
  constructor(){
    super();

    // Clean up
    this.innerHTML = "";

    SwitcherDOM: {
      let buttons = "";

      for(const code of window.CONF.default.language.supported)
        buttons += `<button name="${code}">${Language.codeToFlag(code)}</button>`;

      this.innerHTML = `
        <span for="languageSwitcherTooltip">${Language.codeToFlag(Language.#CURRENT)}</span>
        <x-tooltip event="click" selector="span[for=languageSwitcherTooltip">
          <div class="d-flex flex-row flex-wrap gap-0-5">${buttons}</div>
        </x-tooltip>
      `;
    }


    Buttons: {
      let buttons = this.querySelectorAll("x-tooltip > content > div > button");
      for(const button of buttons)
        button.addEventListener("click", async ()=> await Language.#switchTo(event.target.name));
    }


  }
}

window.customElements.define('x-language', Language);

// Lang Is Alias To Language
class Lang extends Language{}

// Make Language And Lang Usable W/O Importing It
window.Language = Language;
window.Lang = Lang;
