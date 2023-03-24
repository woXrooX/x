//////////////// SPA - Single Page Application
"use strict";

///////////////////////////// Brideg / Fetch
import bridge from "../modules/bridge.js";

//// Custom Elements
import Icon from "./elements/icon.js";
import Toast from "./elements/toast.js";
import Tooltip from "./elements/tooltip.js";
import El from "./elements/el.js";
// import Form from "./elements/form.js";

// import CSS from "./css.js";
// document.head.innerHTML += `<style>${CSS}</style>`;

//// Core Classes
import Language from "./language.js";

import Title from "./title.js";

import Header from "./header.js";
import Main from "./main.js";
import Footer from "./footer.js";

import Hyperlink from "./hyperlink.js";
import Router from "./router.js";
import DOM from "./dom.js";

import Cover from "./cover.js";
import Loading from "./loading.js";
import Menu from "./menu.js";
// import Nav from "./nav.js";

import Form from "./form.js";

export default class Core{

  // Class Static Initialization Block
  static {
    // Try To Load Global Data Then Init The Methods
    Core.#getGlobalData()
    .then(()=>{
      Core.#firstLoad();
      Core.#onLoad();
      Core.#onUrlChange();
      Core.#onHashChange();
      Core.#onHistoryButtonClicked();
      Core.#onDomChange();

    });


  }

  /////// Global Data
  static async #getGlobalData(){
      let response = await window.bridge("api", {for:"globalData"}, "application/json");

      // console.log(response);

      window.CONF = response["CONF"];
      window.session = response["session"];
      window.langCode = response["langCode"];
      window.langDict = response["langDict"];
      window.USER_TYPES = response["USER_TYPES"];
      // window.languages = response["languages"];
      // window.currencies = response["currencies"];
  }

  /////// Event Handlers
  static #firstLoad(){
    // console.log("firstLoad");

    Menu.init();
    Menu.setActive();

    Router.handle();

  }

  static #onLoad(){
    document.addEventListener('readystatechange', ()=>{
      if(event.target.readyState === 'loading') return;
      if(event.target.readyState === 'interactive') return;
      // if(event.target.readyState === 'complete');

      // window.dispatchEvent(new Event('load'));
      console.log("onLoad");

      Router.handle();

      Menu.setActive();

    });
  }

  static #onUrlChange(){
    window.addEventListener('locationchange', ()=>{
      // window.dispatchEvent(new Event('locationchange'));
      // console.log("onUrlChange");

      Router.handle();

      Menu.setActive();

    });
  }

  static #onHashChange(){
    window.addEventListener('hashchange', ()=>{
      // window.dispatchEvent(new Event('hashchange'));
      // console.log("onHashChange");

      // Nav.setActive();

    });
  }

  static #onHistoryButtonClicked(){
    window.addEventListener('popstate', ()=>{
      // window.dispatchEvent(new Event('popstate'));
      // console.log("onHistoryButtonClicked");

      Router.handle();

    });
  }

  static #onDomChange(){
    window.addEventListener('domChange', ()=>{
      // window.dispatchEvent(new CustomEvent('domChange'));
      // window.dispatchEvent(new CustomEvent("domChange", {detail:"menu"}));
      // console.log("onDomChange");

      //// This all should be done inside Dom class
      //// DOM.update() or something
      // Dom Change For body > target
      if(!!event.detail === true)
        for(const target of event.detail)
          switch(target){
            case "menu":
              console.log("Menu");
              Menu.build();
              break;

            case "header":
              console.log("Header");
              break;

            case "main":
            console.log("main");
              DOM.lifeCycle();
              break;

            case "footer":
              console.log("Footer");
              break;

            case "all":
              console.log("All");
              Menu.build();
              DOM.lifeCycle();
              break;

            default:
              console.log("Unknown Target For Dom Change: ", target);

          }

      // Globals
      Hyperlink.collect();
      Form.collect();

    });
  }

};
