"use strict";

export default class Language{

  // Can Be Used For Translations And Just For Normal Use Cases
  static translate(keyword, code = window.langCode){
    try{
      return window.langDict[keyword][code];

    }catch(error){
      return `<b>Language Error:</b> ${error}<br>
              <b>On Keyword:</b> ${keyword}<br>
              <b>Using Language Code:</b> ${code}`;

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
