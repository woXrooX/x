"use strict";

import Dom from "../dom.js";

export default class Form extends HTMLElement{
  static #formElementNames = ["select", "input", "button"];

  constructor(){
    super();

    this.shadow = this.attachShadow({mode: 'closed'});

    DOM: {
      const content = JSON.parse(this.textContent);
      const dom = Dom.jsonToDom(content);
      this.shadow.appendChild(dom);

    }

    // CSS: {
    //     const style = document.createElement('style');
    //     style.textContent = `
    //       form{
    //         display: flex;
    //         flex-direction: column;
    //         gap: var(--gap);
    //
    //       }
    //     `;
    //     this.shadow.appendChild(style);
    //
    // }


  }

};

customElements.define('x-form', Form);

// How To Use
// const form = JSON.stringify({
//   "form":{
//     "attributes":[{"for":"home"}],
//     "childNodes": [
//       {"input":{"attributes":[{"type":"text"},{"name":"username"},{"placeholder":"Username"}]}},
//       {"input":{"attributes":[{"type":"password"},{"name":"password"},{"placeholder":"Password"}]}},
//       {"input":{"attributes":[{"type":"submit"},{"name":"logIn"},{"value":"Log In"}]}}
//     ]
//   }
// });

// const dom = `<x-form>${form}</x-form>`;
