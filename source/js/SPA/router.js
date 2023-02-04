"use strict";

import Dom from "./dom.js";
import Title from "./title.js";


export default class Router{
  static async handle(){
    let link = window.location.pathname;
    let response, content;

    // On "/"
    if(link == "/"){
      // Load The Page
      response = await import(`../pages/home.js`);

      // Render The Content
      Dom.render(response.default());

      // Set Title
      Title.set(response.TITLE);

      // console.log(content);

      return;
    }

    // Try To Load The Page
    try{
      // Load The Page
      response = await import(`../pages${link}.js`);

      // Render The Content
      Dom.render(response.default());

      // Set Title
      Title.set(response.TITLE);

      // console.log(content);

    }catch(error){
      // Error: 404
      if(error.message.search("Failed to fetch dynamically imported module:") !== -1){
        // Change URL To /404
        window.history.pushState("", "", URL+"404");

        // Load The Page 404
        response = await import(`../pages/404.js`);

        // Render The Content
        Dom.render(response.default());

        // Set Title
        Title.set(response.TITLE);

      }else{
        Dom.render(error);

        console.log(error);

      }

      // console.log(content);

    }
  }
}
