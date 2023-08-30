"use strict";

export default class Language{
  static CURRENT = "en";
  static FALLBACK = "en";
  static DICT = {};

  // Can Be Used For Translations And Just For Normal Use Cases
  static translate(keyword, code = Language.CURRENT){
    // Check If keyword Is Valid
    if(!!keyword === false || keyword === '')
      try{return Language.DICT["unknown"][Language.FALLBACK];}
      catch{return "Unknown keyword"}


    try{return Language.DICT[keyword][code];}
    catch(error){
      // Try to use fallback code
      try{return Language.DICT[keyword][Language.FALLBACK];}
      catch{return keyword;}
    }finally{}
  }

  // Just Returns Text For The "keyword"
  static use(keyword){return Language.translate(keyword);}

  static codeToFlag(code){
    switch(code){
      case "en": return "🇬🇧";
      case "uz": return "🇺🇿";
      case "ru": return "🇷🇺";
      default: return "🏴‍☠️";
    }
  }

  static switcher(){
    let buttons = "";

    for(const code of window.CONF.default.language.supported)
      buttons += `
        <button name="${code}">${Language.codeToFlag(code)}</button>
      `;

    return `
      <x-modal trigger="click" type="text" value="${Language.codeToFlag(Language.CURRENT)}">
        <form class="d-flex flex-row flex-warp">
          ${buttons}
        </form>
      </x-modal>
    `;
  }
}


// Lang Is Alias To Language
class Lang extends Language{}

// Make Language And Lang Usable W/O Importing It
window.Language = Language;
window.Lang = Lang;
