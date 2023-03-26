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

    // Left Persentage
    const left = (this.getBoundingClientRect().x / window.innerWidth) * 100;

    Type: {
      this.type = "warning";

      if(this.hasAttribute("type") === true) this.type = this.getAttribute("type").toLowerCase();

      if(!!["success", "info", "warning", "error"].includes(this.type) === false){
        this.type = "warning";
        this.textContent = this.getAttribute("type");

      }
    }



    CSS: {
        const style = document.createElement('style');

        style.textContent = `
        tooltip{
          position: relative;

        }

        tooltip > icon{
          cursor: help;

          width: 20px;

          color: var(--color-${this.type});
          font-size: 1em;
          font-weight: bold;
          text-align: center;

          display: grid;
          place-items: center;

          margin: 0px 5px;
          border: 1px solid transparent;
          border-radius: 5px;

          transition: var(--transition-velocity) ease-in-out;
          transition-property: border;

        }

        icon:hover{
          border: 1px solid var(--color-${this.type});
        }

        tooltip > content{
          pointer-events: none;

          display: block;

          background-color: var(--color-brand);
          color: white;

          opacity: 0;

          padding: calc(var(--padding) * 2);
          border-radius: var(--radius);
          box-shadow: 0px 0px 10px var(--color-brand);

          max-width: 40vw;
          width: max-content;
          height: max-content;

          position: absolute;
          z-index: var(--z-tooltip);
          left: 50%;
          top: 0%;
          transform: translate(${left < 50 ? -left:-50}%, -100%);
          transform-origin: center;

          transition: var(--transition-velocity) ease-in-out;
          transition-property: opacity, transform;

        }

        icon:hover + content{
          opacity: 1;
          transform: translate(${left < 50 ? -left:-50}%, calc(-100% - 12px));

        }

        tooltip > content::after{
          content: "";
          position: absolute;
          top: 100%;
          left: ${left}%;
          margin-left: -5px;
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
    this.shadow.querySelector("tooltip>content").innerHTML = window.Lang.use(this.textContent);

  }

  static new(type, content, parentSelector){
    if(!!type === false || !!content === false || !!parentSelector === false) return;


    document.querySelector(parentSelector).innerHTML += `<x-tooltip type="${type}">${content}</x-tooltip>`;

  }
}
customElements.define('x-tooltip', Tooltip);

// Make Tooltip Usable W/O Importing It
window.Tooltip = Tooltip;
