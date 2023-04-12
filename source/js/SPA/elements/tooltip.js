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
    this.shadow.querySelector("tooltip>content").innerHTML = window.Lang.use(this.innerHTML);

    // Left Persentage
    const left = (this.getBoundingClientRect().x / window.innerWidth) * 100;

    MouseEvents: {
      const contentElement = this.shadow.querySelector("tooltip>content");

      this.shadow.querySelector("tooltip>icon").onmouseover = ()=>{
        const rect = this.shadow.querySelector("tooltip>content").getBoundingClientRect();

        // Left Out
        if(rect.left < 0) contentElement.classList.add("showOnRight");

        // Top Out
        if(rect.top - rect.height < 0) contentElement.classList.add("showOnBottom");

        // Bottom Out
        // if(rect.bottom > window.innerHeight) console.log("Bottom out");

        // Right Out
        if(rect.right > window.innerWidth) contentElement.classList.add("showOnLeft");

        // Default
        contentElement.classList.add("showOnTop");

      };

      // On Mouse Out Remove Class
      this.shadow.querySelector("tooltip>icon").onmouseout = ()=>{contentElement.removeAttribute("class");};

    }

    CSS: {
        const style = document.createElement('style');

        style.textContent = `
          tooltip{
            position: relative;

          }

          tooltip > icon{
            cursor: help;

            width: 30px;

            color: ${window.CSS.values.color[this.type]};
            font-size: 1em;
            font-weight: bold;
            text-align: center;

            display: grid;
            place-items: center;

            margin: 0px 5px;
            border: 1px solid transparent;
            border-radius: 5px;

            transition: ${window.CSS.values.transition.velocity} ease-in-out;
            transition-property: border;

          }

          icon:hover{
            border: 1px solid ${window.CSS.values.color[this.type]};
          }

          tooltip > content{
            pointer-events: none;

            display: block;

            background-color: ${window.CSS.values.color.main};
            color: white;

            opacity: 0;

            padding: calc(${window.CSS.values.padding.default} * 2);
            border-radius: ${window.CSS.values.radius.default};
            box-shadow: 0px 0px 10px ${window.CSS.values.color.main};
            box-sizing: border-box;

            max-width: 40vw;
            width: max-content;
            height: max-content;

            position: absolute;
            z-index: ${window.CSS.values.zIndex.tooltip};
            left: 50%;
            top: 0%;
            transform: translate(-50%, calc(-50% + 10px));
            transform-origin: center;

            transition: ${window.CSS.values.transition.velocity} ease-in-out;
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
            transform: rotate(180deg);
            transform-origin: top;

          }

          tooltip > content.showOnRight{
            transform: translate(calc(0% + 22px), calc(-50% + 10px));

          }

          tooltip > content.showOnRight::after{
            top: 50%;
            left: 0%;
            transform: rotate(90deg);
            transform-origin: top;

          }

          tooltip > content.showOnLeft{
            transform: translate(calc(-100% - 42px), calc(-50% + 10px));

          }

          tooltip > content.showOnLeft::after{
            top: 50%;
            left: 100%;
            transform: rotate(270deg);
            transform-origin: top;

          }

          tooltip > content::after{
            content: "";

            position: absolute;

            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: var(--color-main) transparent transparent transparent;

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
