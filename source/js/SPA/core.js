// class static initialization block
// class Clazz{
//   static #shown = true;
//   static{
//     this.#shown = false;
//     Clazz.#shown = false; same as above
//   }

//////////////// SPA - Single Page Application

"use strict";

// import CSS from "./css.js";
// document.head.innerHTML += `<style>${CSS}</style>`;

import Dom from "./dom.js";
import Title from "./title.js";
import Router from "./router.js";
// import Cover from "./cover.js";

// import Form from "./form.js";
import Hyperlink from "./hyperlink.js";
import Loading from "./loading.js";
import Menu from "./menu.js";
// import Nav from "./nav.js";


// import Former from "./elements/former.js";
// import Toast from "./elements/toast.js";

// document.querySelector("body > main > main > section").innerHTML =
// // element:{attributes:value, ..}
// `<wxx-form>{
//   "form":{"method": "POST"},
//   "elements":[
//     {"section":{"class": "clazz"}},
//     {"input":{"type": "text", "name": "username", "placeholder": "Username"}},
//     {"input":{"type":"submit", "name": "logIn", "placeholder": "Log In"}}
//   ]
// }</wxx-form>
// `;



export default class Core{
  static {
    Core.#onLoad();
    Core.#onUrlChange();
    Core.#onHashChange();
    Core.#onDomChange();
  }

  /////// Event Handlers
  static #onLoad(){
    document.addEventListener('readystatechange', ()=>{
      if(event.target.readyState === 'loading') return;
      if(event.target.readyState === 'interactive') return;
      // if(event.target.readyState === 'complete');

      // window.dispatchEvent(new Event('load'));
      // console.log("onLoad");

      Router.handle();

      Menu.setActive();

      Loading.done();

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

  static #onDomChange(){
    window.addEventListener('domChange', ()=>{
      // window.dispatchEvent(new CustomEvent('domChange'));
      // console.log("onDomChange");

      Hyperlink.collect();
      // Form.collect();

    });
  }

};
