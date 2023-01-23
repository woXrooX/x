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

      // Get The Content
      content = await response.default();

      // Render The Content
      Dom.render(content);

      // Set Title
      Title.set(response.TITLE);

      // console.log(content);

      return;
    }

    // Try To Load The Page
    try{
      // Load The Page
      response = await import(`../pages${link}.js`);

      // Get The Content
      content = await response.default();

      // Render The Content
      Dom.render(content);

      // Set Title
      Title.set(response.TITLE);

      // console.log(content);

    }catch(error){
      // Error: 404
      if(error instanceof TypeError){
        // Change URL To /404
        window.history.pushState("", "", URL+"404");

        // Load The Page 404
        response = await import(`../pages/404.js`);

        // Get The Content
        content = await response.default();

        // Render The Conten
        Dom.render(content);

        // Set Title
        Title.set(response.TITLE);

      }else if(error instanceof ReferenceError){
        console.log(error);

      }

      // console.log(content);

    }
  }
}
