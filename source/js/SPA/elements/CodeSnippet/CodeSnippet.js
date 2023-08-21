"use strict";

import JavaScript from "./languages/JavaScript.js";
import HTML from "./languages/HTML.js";

export default class CodeSnippet extends HTMLElement{
  //// Native Form Behaviour
  // Identify the element as a form-associated custom element
  static formAssociated = true;

  static #template = document.createElement("template");

  static {
    CodeSnippet.#template.innerHTML = `
      <div>
        <code>
        </code>
      </div>
    `;
  }

  constructor(){
    super();

    this.shadow = this.attachShadow({mode: 'closed'});

    ////// RAW data
    this.RAW = this.innerHTML;

    // Remove 1st new line
    this.RAW = this.RAW.substring(1, this.RAW.length);

    // Remove last new lines
    this.RAW = this.RAW.substring(0, this.RAW.length-5);

    // If language is not defined, then exit
    if(!!this.hasAttribute("lang") === false) this.lang = "RAW";

    CSS: {
        const style = document.createElement('style');
        style.textContent = `
          :host(code-snippet){
            display: block;
          }

          div{
            position: relative;

            &:hover::after{
              opacity: 1;
            }

            &::after{
              content: "${this.lang}";
              opacity: 0.1;

              background-color: white;

              color: hsla(230, 13%, 9%, 1);
              font-size: 0.7rem;
              font-family: Tahoma;

              width: auto;
              height: auto;
              padding: 2px 4px 3px 5px;
              border-radius: 3px;

              position: absolute;
              right: 5px;
              top: 5px;

              transition: 200ms ease-in-out opacity;
            }

            & > code{
              display: block;

              background-color: hsla(230, 13%, 9%, 1);

              color: white;
              font-size: 0.7rem;
              line-height: 0.8rem;
              white-space: pre;

              width: auto;
              height: auto;

              box-sizing: border-box;
              border-radius: 5px;
              padding: 10px;
              padding-top: 15px;
              box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.5);

              overflow-x: scroll;
              scrollbar-width: auto;
              scrollbar-color: hsla(230, 13%, 40%, 0.5) transparent;

              &::-webkit-scrollbar{
                display: unset;
                width: 5px;
                height: 5px;
              }

              &::-webkit-scrollbar-track{
                background-color: transparent;
              }

              &::-webkit-scrollbar-thumb{
                background-color: hsla(230, 13%, 25%, 0.5);
                border-radius: 5px;
              }

              &::-webkit-scrollbar-thumb:hover{
                background-color: hsla(230, 13%, 40%, 0.5);
              }
            }
          }

        `;
        this.shadow.appendChild(style);
    }

    // Clone And Append Template
    this.shadow.appendChild(CodeSnippet.#template.content.cloneNode(true));

    this.codeElement = this.shadow.querySelector("div > code");

    switch(this.lang){
      case "JavaScript":
        this.codeElement.innerHTML = JavaScript.handle(this.RAW);
        break;

      case "HTML":
        this.codeElement.innerHTML = HTML.handle(this.RAW);
        break;

      default:
        this.codeElement.innerText = this.RAW;
        console.warn("Code-Snippet: Not supported language!");
    }
  }

};

window.customElements.define('code-snippet', CodeSnippet);

// Make CodeSnippet Usable W/O Importing It
window.CodeSnippet = CodeSnippet;
