"use strict";

export default class Language{

  // Can Be Used For Translations And Just For Normal Use Cases
  static translate(keyword, code = window.langCode){
    // Check If keyword Is Valid
    if(!!keyword === false) return window.langDict["unkow"][code];

    try{
      return window.langDict[keyword][code];

    }catch(error){
      return keyword;

    }finally{}

  }

  // Just Returns Text For The "keyword"
  static use(keyword){ return Language.translate(keyword);}

}


// Lang Is Alias To Language
class Lang extends Language{}

// Make Language And Lang Usable W/O Importing It
window.Language = Language;
window.Lang = Lang;
