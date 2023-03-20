"use strict";

export default class Tooltip extends HTMLElement{
  static #template = document.createElement("template");

  static {
    Tooltip.#template.innerHTML = `
      <tooltip>
        <icon></icon>
        <content></content>
      </tooltip>
    `;
  }

  constructor(){
    super();

    this.shadow = this.attachShadow({mode: 'closed'});

    Type: {
      this.typeName = "warning";
      const attributeType = this.getAttribute("type").toLowerCase();
      if(["info", "warning", "error"].includes(attributeType)) this.typeName = attributeType;
      else this.textContent = this.getAttribute("type");
    }

    CSS: {
        const style = document.createElement('style');
        
        style.textContent = `
        tooltip{
          background-color: red;
        }
        `;

        this.shadow.appendChild(style);

    }

    // Clone And Append Template
    this.shadow.appendChild(Tooltip.#template.content.cloneNode(true));

    // If typeName === TRUE Append Type Specific Icon Else Append "warning" Icon
    this.shadow.querySelector("toast>main>icon").innerHTML = !!ICONS[this.typeName] ? ICONS[this.typeName] : ICONS["warning"];

    // InnerHTML "typeName"
    this.shadow.querySelector("toast>main>type").innerHTML = Language.translate(this.typeName);

    // InnerHTML "textContent"
    this.shadow.querySelector("toast>main>content").innerHTML = Language.translate(this.textContent);

    // InnerHTML Close Button Icon
    this.shadow.querySelector("toast>dismiss").innerHTML = ICONS["close"];

    // Remove Tooltip On Click Dismiss
    // dismiss.onclick = ()=> this.remove(); // Bug w/ N sec removal
    this.shadow.querySelector("toast>dismiss").onclick = ()=> this.style.display = "none";
  }

  static new(type, content){
    if(!!type === false || !!content === false) return;


    document.querySelector(Tooltip.#selector).innerHTML += `<x-toast type="${type}">${content}</x-toast>`;

    // Auto Remove After N Seconds
    setTimeout(()=>{document.querySelector(Tooltip.#selector).firstChild?.remove();}, Tooltip.#autoDismissTimer);

  }
}
customElements.define('x-tooltip', Tooltip);

// Make Tooltip Usable W/O Importing It
window.Tooltip = Tooltip;
