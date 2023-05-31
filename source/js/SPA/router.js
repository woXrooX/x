"use strict";

export default class Router{
  // Init Current Page With Initial Pathname
  static currentPage = window.location.pathname;

  static async handle(){
    // Check If App Is Down If So Stop Handling Set appIsDown As Current Page
    if("appIsDown" in window.CONF["default"]){
      window.DOM.setPage(await import(`../pages/appIsDown.js`));
      return;
    }

    let endpoint = null;

    // We have much efficient way of detecting if page exists if we give up on alias system
    // Loop Through Pages
    loopPages:
    for(const page in window.CONF["pages"]){
      // console.log(page);

      // Pass The Page To routeGuard Tests
      if(Router.routeGuard(page) === false) continue;

      // Aliases
      loopAliases:
      for(const alias of window.CONF["pages"][page]["endpoints"])

        // Check If Page Alias Equals To Currnt Endpoint
        if(alias == window.location.pathname){
          endpoint = '/'+page;

          // Check If Page Is Not Current Loaded Page
          if(
            '/'+Router.currentPage == window.location.pathname ||
            Router.currentPage === "home" &&
            window.location.pathname === '/'
          ) return;

          Router.currentPage = page;

          // Break Out Of The Loops
          break loopPages;

        }

    }

    // If Still No Alias Matched Then Set It To "/404"
    if(endpoint === null) endpoint = "/404";

    try{
      // Start Loading Effect
      window.Loading.start();

      // Change URL To /404 In Case endpoint Is /404
      // Currntly causing infintive back and forth page looping
      // if(endpoint === "/404") window.history.pushState("", "", URL+"404");

      // Load The Page
      window.DOM.setPage(await import(`../pages${endpoint}.js`));

    }catch(error){
      console.log(error);
      console.log(error.stack);

      // Set Title To Error
      window.Title.set("error");

      // Render The Error
      window.DOM.render(`
        <container>
          
          <row class="m-t-5 box-default p-5 w-50">
            <column>
              <error>${error.name}</error>
              <info>${error.stack}</info>
            </column>
          </row>        
        </container>
      `);

    }finally{
      // End Loading Effect
      window.Loading.end();

    }

  }

  static routeGuard(page){
    // Check If Page Exists
    // Already Looping Through Existent Pages


    // Check If Page Is Enabled
    if(window.CONF["pages"][page]["enabled"] === false) return false;


    // Everyone
    if(
      !("authenticity_statuses" in window.CONF["pages"][page]) &&
      !("roles" in window.CONF["pages"][page]) &&
      !("plans" in window.CONF["pages"][page])
    ) return true;


    // Session Dependent Checks
    if("user" in window.session){

      // Root
      if(window.session["user"]["roles"].includes("root")) return true;

      ///// Authenticity Statuses
      let authenticity_check = false;
      if("authenticity_statuses" in window.CONF["pages"][page]){
        for(const authenticity_status in window.USER_AUTHENTICITY_STATUSES)
          if(
            window.session["user"]["authenticity_status"] == window.USER_AUTHENTICITY_STATUSES[authenticity_status]["id"] &&
            window.CONF["pages"][page]["authenticity_statuses"].includes(authenticity_status)
          ) authenticity_check = true;

      }else authenticity_check = true;

      ///// Roles
      let role_check = false;
      if("roles" in window.CONF["pages"][page]){
        // Check If One Of The User Assigned Roles Match With The CONF[page]["roles"]
        for(let i = 0; i < window.session["user"]["roles"].length; i++)
          if(window.CONF["pages"][page]["roles"].includes(window.session["user"]["roles"][i])){
            role_check = true;
            break;
          }

      }else role_check = true;

      ///// Plans - similar to role check
      let plan_check = true; // Should be false in actual implementation

      ///// Final Check: IF All Checks Passed
      if(
        authenticity_check === true &&
        role_check === true &&
        plan_check === true
      ) return true;

    }


    // Session Independent Checks
    if(!("user" in window.session)){
      ///// Authenticity Statuses
      let authenticity_check = false;
      // Unauthenticated User
      if(
        !("authenticity_statuses" in window.CONF["pages"][page]) ||
        "authenticity_statuses" in window.CONF["pages"][page] &&
        window.CONF["pages"][page]["authenticity_statuses"].includes("unauthenticated")
      ) authenticity_check = true;

      ///// Roles
      let role_check = false;
      if(!("roles" in window.CONF["pages"][page])) role_check = true;

      ///// Plans
      let plan_check = false;
      if(!("plans" in window.CONF["pages"][page])) plan_check = true;

      ///// Final Check: IF All Checks Passed
      if(
        authenticity_check === true &&
        role_check === true &&
        plan_check === true
      ) return true;

    }


    // Failed The Guard Checks
    return false;

  }

}

// Make Router Usable W/O Importing It
window.Router = Router;
