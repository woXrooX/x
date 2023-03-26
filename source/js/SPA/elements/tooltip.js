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

      if(this.hasAttribute("type") === true) this.type = this.getAttribute("type").toLowerCase();

      if(!!["success", "info", "warning", "error"].includes(this.type) === false){
        this.type = "warning";
        this.textContent = this.getAttribute("type");

      }
    }

    // Clone And Append Template
    this.shadow.appendChild(Tooltip.#template.content.cloneNode(true));

    // If type === TRUE Append Type Specific Icon Else Append "warning" Icon
    this.shadow.querySelector("tooltip>icon").innerHTML = !!ICONS[this.type] ? ICONS[this.type] : ICONS["warning"];

    // InnerHTML "textContent"
    this.shadow.querySelector("tooltip>content").innerHTML = window.Lang.use(this.textContent);

    // Left Persentage
    const left = (this.getBoundingClientRect().x / window.innerWidth) * 100;

    ContentDetails: {
      const distance = "12px";

      const contentElement = this.shadow.querySelector("tooltip>content");
      const content = {
        x: contentElement.offsetLeft,
        y: contentElement.offsetTop,
        // width: contentElement.offsetWidth,
        // height: contentElement.offsetHeight

      }
      // console.log(content);

      this.shadow.querySelector("tooltip>icon").onmouseover = ()=>{
        const rect = this.shadow.querySelector("tooltip>content").getBoundingClientRect();

        console.log("window width / height", window.innerWidth ,window.innerHeight);

        if (rect.left < 0){
          console.log("Left out");
        }

        if(rect.top < 0){
          console.log("Top out");
          contentElement.classList.add("showOnBottom");


        }

        if(rect.bottom > window.innerHeight){
          console.log("Bottom out");
        }

        if(rect.right > window.innerWidth){
          console.log("Right out");
        }

        // Default
        contentElement.classList.add("showOnTop");

      };

      this.shadow.querySelector("tooltip>icon").onmouseout = ()=>{
        contentElement.removeAttribute("class");
      };

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
          box-sizing: border-box;

          max-width: 40vw;
          width: max-content;
          height: max-content;

          position: absolute;
          z-index: var(--z-tooltip);
          left: 50%;
          top: 0%;
          transform: translate(-50%, -100%);
          transform-origin: center;

          transition: var(--transition-velocity) ease-in-out;
          transition-property: opacity, transform;

        }

        tooltip > content.showOnTop{
          transform: translate(-50%, calc(-100% - 12px));

        }

        tooltip > content.showOnTop::after{
          top: 100%;
          left: 50%;

        }

        tooltip > content.showOnBottom{
          transform: translate(-50%, 30px);

        }

        tooltip > content.showOnBottom::after{
          top: 0%;
          left: 50%;
          transform: rotate(180deg) scale(1);
          transform-origin: top;

        }

        tooltip > content::after{
          content: "";

          position: absolute;

          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: var(--color-brand) transparent transparent transparent;

        }

        icon:hover + content{
          opacity: 1;

        }

        `;

        this.shadow.appendChild(style);

    }

  }

  static new(type, content, parentSelector){
    if(!!type === false || !!content === false || !!parentSelector === false) return;


    document.querySelector(parentSelector).innerHTML += `<x-tooltip type="${type}">${content}</x-tooltip>`;

  }
}
customElements.define('x-tooltip', Tooltip);

// Make Tooltip Usable W/O Importing It
window.Tooltip = Tooltip;
