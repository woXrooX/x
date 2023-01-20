"use strict";

export default class Html{
  static render(dom){
    document.querySelector("body > main").innerHTML = dom;

  }

};
