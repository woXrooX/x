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
      <pre>
        <code>
        </code>
      </pre>
    `;
  }

  constructor(){
    super();

    this.shadow = this.attachShadow({mode: 'closed'});
    this.RAW = this.innerHTML;

    // If language is not defined, then exit
    if(!!this.hasAttribute("lang") === false) this.lang = "RAW";

    CSS: {
        const style = document.createElement('style');
        style.textContent = `
          pre{
            background-color: hsla(230, 13%, 9%, 1);
            width: auto;
            height: auto;
            border-radius: 5px;
            box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.5);
            padding: 0px 15px;
            font-size: 0.7rem;

            overflow-x: scroll;
            scrollbar-width: auto;
            scrollbar-color: var(--color-brand) transparent;

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

            & > code{
              display: block;
              color: white;
              width: 100%;
              height: 100%;
              line-height: 0.8rem;

              position: relative;

              &:hover::after{
                opacity: 1;
              }

              &::after{
                content: "${this.lang}";
                opacity: 0.3;

                background-color: white;
                color: hsla(230, 13%, 9%, 1);

                width: auto;
                height: auto;
                padding: 2px 2px 0px 2px;
                border-radius: 2px;

                position: absolute;
                right: 0px;
                top: 0px;

                transition: 200ms ease-in-out opacity;
              }
            }
          }
        `;
        this.shadow.appendChild(style);
    }

    // Clone And Append Template
    this.shadow.appendChild(CodeSnippet.#template.content.cloneNode(true));

    this.codeElement = this.shadow.querySelector("pre > code");

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
