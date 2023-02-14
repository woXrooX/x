"use strict";

export default class Title{
  static set(newTitle = ""){
    if(!!newTitle === false) document.title = window.CONF["default"]["title"];
    else document.title = newTitle + " | " + window.CONF["default"]["title"];
  }
}
