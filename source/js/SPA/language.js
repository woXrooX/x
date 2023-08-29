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
}


// Lang Is Alias To Language
class Lang extends Language{}

// Make Language And Lang Usable W/O Importing It
window.Language = Language;
window.Lang = Lang;
