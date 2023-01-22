"use strict";

import Html from "./html.js";
import Title from "./title.js";


export default class Router{
  static async handle(){
    let link = window.location.pathname;
    let response, content;

    // On "/"
    if(link == "/"){
      response = await import(`../pages/home.js`);
      content = await response.default();
      Html.render(content);

      // If TITLE Exists Then Set
      if(!!response.TITLE) Title.set(response.TITLE);

      console.log(content);

      return;
    }

    // Try To Load Page
    try{
      response = await import(`../pages${link}.js`);
      content = await response.default();
      Html.render(content);

      // If TITLE Exists Then Set
      if(!!response.TITLE) Title.set(response.TITLE);

      console.log(content);

    }catch(error){
      response = await import(`../pages/404.js`);
      content = await response.default();
      Html.render(content);

      // If TITLE Exists Then Set
      if(!!response.TITLE) Title.set(response.TITLE);

      console.log(content);

    }
  }
}
