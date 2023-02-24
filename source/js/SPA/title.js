"use strict";

export default class Title{
  static set(newTitle = ""){
    if(!!newTitle === false) document.title = window.CONF["default"]["title"];
    else document.title = newTitle + " | " + window.CONF["default"]["title"];
  }
}

// Make Title Usable W/O Importing It
window.Title = Title;
