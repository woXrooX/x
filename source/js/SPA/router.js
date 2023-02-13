"use strict";

import Dom from "./dom.js";
import Title from "./title.js";


export default class Router{
  static async handle(){
    let endpoint = null;

    // Loop Through Pages
    for(const page in window.conf["pages"]){

      // Aliases
      for(const alias of window.conf["pages"][page]["aliases"]){

        if(
          // Check If Page Is Enabled
          window.conf["pages"][page]["enabled"] === true &&

          // Check If Page Alias Equals To Currnt Endpoint
          alias == window.location.pathname

        ) endpoint = '/'+page;

        // If Still No Alias Matched Then Set To "/404"
        else if(endpoint === null) endpoint = "/404";

      }

    }

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

      Dom.render(error);

    }

  }

}
