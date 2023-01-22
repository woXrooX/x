"use strict";

export default class Title{
  static set(newTitle = ""){
    if(newTitle == "" || newTitle == null) document.title = "XSite";
    else document.title = "XSite | "+newTitle;
  }
}
