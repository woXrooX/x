"use strict";

export default class Language{
  static translate(keyword, code = window.langCode){
    try{
      return window.langDict[keyword][code];

    }catch(error){
      return `<b>Language Error:</b> ${error}<br>
              <b>On Keyword:</b> ${keyword}`;

    }finally{}

  }
}
