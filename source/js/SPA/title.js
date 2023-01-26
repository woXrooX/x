"use strict";

export default class Title{
  static set(newTitle = ""){
    if(newTitle == "" || newTitle == null || newTitle == undefined) document.title = window.conf["default"]["title"];
    else document.title = newTitle + " | " + window.conf["default"]["title"];
  }
}
