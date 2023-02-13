"use strict";

export default class Title{
  static set(newTitle = ""){
    if(!!newTitle === false) document.title = window.conf["default"]["title"];
    else document.title = newTitle + " | " + window.conf["default"]["title"];
  }
}
