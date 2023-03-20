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
      this.type = "warning";
      let attributeType = this.type;
      if(this.hasAttribute("type") === true) attributeType = this.getAttribute("type").toLowerCase();
      if(["info", "warning", "error"].includes(attributeType)) this.type = attributeType;
      else this.textContent = this.getAttribute("type");
    }

    console.log(this.type);
    console.log(this.textContent);

    CSS: {
        const style = document.createElement('style');

        style.textContent = `
        tooltip{}

        tooltip > icon{
          cursor: help;

          background-color: var(--color-${this.type});
          color: white;
          text-align: center;
          padding: 3px 10px;
          border-radius: 100%;
        }

        icon:hover + content{
          opacity: 1;
          transform: translate(-50%, -120%);
        }

        tooltip > content{
          pointer-events: none;

          background-color: var(--color-brand);
          color: white;

          opacity: 0;

          padding: var(--padding);
          border-radius: var(--radius);
          box-shadow: 0px 0px 10px var(--color-brand);

          max-width: 30vw;
          height: auto;

          position: absolute;
          transform: translate(-50%, -100%);

          transition: var(--transition-velocity) ease-in-out;
          transition-property: opacity, transform;

        }

        tooltip > content::after{
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -17px;
          border-width: 5px;
          border-style: solid;
          border-color: var(--color-brand) transparent transparent transparent;

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
customElements.define('x-tooltip', Tooltip);

// Make Tooltip Usable W/O Importing It
window.Tooltip = Tooltip;
