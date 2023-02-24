"use strict";

export default class Hyperlink{

  static collect(){
    const links = document.getElementsByTagName("a");

    for(const a of links){
      a.onclick = ()=>{

        // Check IF Href Is Only Hash.
        if(a.getAttribute("href").charAt(0) == '#') return;

        // Remove Forward Slash From Href
        let href = a.getAttribute("href").substring(1, a.getAttribute("href").length);

        event.preventDefault();

        Hyperlink.locate(href);

      }
    }
  }

  // locate | load | open
  static locate(path = ""){
    // Check If Current Page Is Already Equal To Requesting Page
    if(window.location.href == URL+path) return;

    //// Change Url / Add To History
    window.history.pushState("", "", URL+path);

    // Firing Event "locationchange" After Changing URL
    window.dispatchEvent(new Event('locationchange'));

  }
}

// Make Hyperlink Usable W/O Importing It
window.Hyperlink = Hyperlink;
