"use strict";

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
      window.Dom.render(response.default());

      // Set Title
      window.Title.set(response.TITLE);

    }catch(error){
      console.log(error);

      // Set Title To Error
      window.Title.set("error");

      // Render The Error
      window.Dom.render(error);

    }

  }

  static #routeGuard(page){
    // Check If Page Exists
    // Already Looping Through Existent Pages


    // Check If Page Is Enabled
    if(window.CONF["pages"][page]["enabled"] === false) return false;


    // Everyone
    if(window.CONF["pages"][page]["allowed"].includes("everyone")) return true;


    // Session Dependent Checks
    if("user" in window.session){

    // Root
    if(window.session["user"]["type"] == window.USER_TYPES["root"]["id"]) return true;

    // If User Type Matches With One Of The Page's Allowed User Types
    for(let user_type in window.USER_TYPES)
      if(
        window.session["user"]["type"] == window.USER_TYPES[user_type]["id"] &&
        window.CONF["pages"][page]["allowed"].includes(user_type)
      )
      return true;

    }


    // Session Independent Checks
    if(!("user" in window.session)){
      // Unauthenticated User
      if(window.CONF["pages"][page]["allowed"].includes("unauthenticated")) return true;

    }


    // Failed The Guard Checks
    return false;

  }

}

// Make Router Usable W/O Importing It
window.Router = Router;
