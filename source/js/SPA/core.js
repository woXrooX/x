//////////////// SPA - Single Page Application
"use strict";

///////////////////////////// Brideg / Fetch
import bridge from "../modules/bridge.js";

// import CSS from "./css.js";
// document.head.innerHTML += `<style>${CSS}</style>`;

//// Core Classes
import Language from "./language.js";

import Title from "./title.js";
import SVG from "./svg.js";
import CSS from "./css.js";

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

//// Custom Elements
import Icon from "./elements/icon.js";
import Modal from "./elements/modal.js";
import Copy from "./elements/copy.js";
import Share from "./elements/share.js";
import Toast from "./elements/toast.js";
import Tooltip from "./elements/tooltip.js";
import Select from "./elements/select.js";
import El from "./elements/el.js";
// import Form from "./elements/form.js";

export default class Core{

  // Class Static Initialization Block
  static {
    // Try To Get Initial Data Then Init The Methods
    Core.#getInitialData()
    .then(()=>{
      Core.#firstLoad();
      Core.#onLoad();
      Core.#onUrlChange();
      Core.#onHashChange();
      Core.#onHistoryButtonClicked();
      Core.#onDomChange();

    });


  }

  /////// Initial Data
  static async #getInitialData(){
      let response = await window.bridge("api", {for:"initialData"});

      // console.log(response);

      window.CONF = response["CONF"];
      window.session = response["session"];
      window.LANG_CODE = response["LANG_CODE"];
      window.LANG_DICT = response["LANG_DICT"];
      window.USER_AUTHENTICITY_STATUSES = response["USER_AUTHENTICITY_STATUSES"];
      window.USER_ROLES = response["USER_ROLES"];

      // Load External SVGs To SVG Class
      window.SVG.set(response["PROJECT_SVG"]);
  }

  /////// Event Handlers
  static #firstLoad(){
    console.log("firstLoad");

    CSS.init();

    Menu.init();
    Menu.setActive();

    Footer.init();

    Router.handle();


  }

  static #onLoad(){
    // Works On The First Visit
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
