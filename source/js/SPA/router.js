"use strict";

import Dom from "./dom.js";
import Title from "./title.js";


export default class Router{
  static async handle(){
    let endpoint = null;

    // Loop Through Pages
    loopPages:
    for(const page in window.CONF["pages"]){
      // console.log(page);

      // Pass The Page Guard Tests
      if(Router.#routeGuard(page) === false) continue;

      // Aliases
      loopAliases:
      for(const alias of window.CONF["pages"][page]["aliases"])

        // Check If Page Alias Equals To Currnt Endpoint
        if(alias == window.location.pathname){
          endpoint = '/'+page;
          // Break Out Of The Loops
          break loopPages;
        }

    }

    // If Still No Alias Matched Then Set It To "/404"
    if(endpoint === null) endpoint = "/404";

    try{
      // Change URL To /404 In Case endpoint Is /404
      // Currntly causing infintive back and forth page looping
      // if(endpoint === "/404") window.history.pushState("", "", URL+"404");

      // Load The Page
      const response = await import(`../pages${endpoint}.js`);

      // Render The Content
      Dom.render(response.default());

      // Set Title
      Title.set(response.TITLE);

    }catch(error){
      console.log(error);

      // Render The Error
      Dom.render(error);

    }

  }

  static #routeGuard(page){
    // Check If Page Is Enabled
    if(window.CONF["pages"][page]["enabled"] === false) return false;

     // Looping Through Page's Allowance List
    for(const allowed of window.CONF["pages"][page]["allowed"]){
      // Only Allowed "unauthenticated" Users
      if(allowed == "unauthenticated" && "user" in window.session) return false;

      // Only Allowed "unauthorized" Users
      if(allowed == "unauthorized")
        if(!("user" in window.session) || "user" in window.session && window.session["user"]["type"] != window.USER_TYPES["unauthorized"]["id"])
          return false;

      // Only Allowed "authorized" Users
      if(allowed == "authorized")
        if(!("user" in window.session) || ("user" in window.session && window.session["user"]["type"] != window.USER_TYPES["authorized"]["id"]))
          return false;

    }

    // Passed The Guard Checks
    return true;

  }

}
