"use strict";

export default class Copy extends HTMLElement{
  static #template = document.createElement("template");

  static {
    Tooltip.#template.innerHTML = `
      <copy>
        <icon></icon>
      </copy>
    `;
  }

  constructor(){
    super();

    this.shadow = this.attachShadow({mode: 'closed'});


    Selector: {
      console.log(this.selector);
    }

    CSS: {
        const style = document.createElement('style');

        style.textContent = `
          copy{

          }

          copy > icon{

          }
        `;

        this.shadow.appendChild(style);

    }

    // Clone And Append Template
    this.shadow.appendChild(Tooltip.#template.content.cloneNode(true));

    // If type === TRUE Append Type Specific Icon Else Append "warning" Icon
    this.shadow.querySelector("tooltip>icon").innerHTML = !!ICONS[this.type] ? ICONS[this.type] : ICONS["warning"];

    // InnerHTML "textContent"
    this.shadow.querySelector("tooltip>content").innerHTML = Language.translate(this.textContent);

  }

  static new(type, content, parentSelector){
    if(!!type === false || !!content === false || !!parentSelector === false) return;


    document.querySelector(parentSelector).innerHTML += `<x-tooltip type="${type}">${content}</x-tooltip>`;

  }
}
customElements.define('x-copy', Copy);

// Make Copy Usable W/O Importing It
window.Copy = Copy;
