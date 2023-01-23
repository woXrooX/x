"use strict";

export default class Title{
  static set(newTitle = ""){
    if(newTitle == "" || newTitle == null || newTitle == undefined) document.title = "XSite";
    else document.title = newTitle + " | XSite";
  }
}
