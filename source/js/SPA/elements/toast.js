"use strict";

// Raw HTML
// <x-toast type="typeName">Content</x-toast>

export default class Toast extends HTMLElement{
  static #selector = "body>toasts";
  static #autoDismissTimer = 5000;
  static #template = document.createElement("template");

  static {
    Toast.#template.innerHTML = `
      <toast>
        <labelcolor></labelcolor>
        <main>
          <icon></icon>
          <type></type>
          <content></content>
        </main>
        <dismiss></dismiss>
      </toast>
    `;
  }

  constructor(){
    super();

    // this.attachShadow({mode: 'open'});
    this.shadow = this.attachShadow({mode: 'closed'});

    Type: {
      this.typeName = "warning";
      let attributeType = this.typeName;
      if(this.hasAttribute("type") === true) attributeType = this.getAttribute("type").toLowerCase();
      if(["success", "info", "warning", "error"].includes(attributeType)) this.typeName = attributeType;
      else this.textContent = this.getAttribute("type");
    }

    CSS: {
        const style = document.createElement('style');

        // :host(:hover) {
        //   opacity: 1;
        // }
        // :host{
        //
        // }
        style.textContent = `
        toast{
          overflow: hidden;

          background-color: ${window.CSS.values.color.surface["1"]};
          padding: ${window.CSS.values.padding.default};
          margin: 0px;
          border-radius: ${window.CSS.values.radius.default};

          box-shadow: ${window.CSS.values.shadow.default};

          display: grid;
          gap: 10px;
          grid-template-columns:auto 2fr auto;
          align-items: center;

          animation: fadeIn ${window.CSS.values.transition.velocity} ease;
        }
        @keyframes fadeIn{
          0%{transform:translateY(-10px);}
          100%{transform:translateY(0px);}
        }

        labelColor{
          background-color: ${window.CSS.values.color[this.typeName]};
          height: 100%;
          width: 5px;
          border-radius: ${window.CSS.values.radius.default};
        }

        toast > main{
          display: grid;
          grid-template-columns:auto 2fr;
          grid-template-areas:
            "icon type"
            "content content";
          align-items: center;
        }

        toast > main > icon{
          font-size: 30px;
          padding-right: 5px;
          color: ${window.CSS.values.color[this.typeName]};
          grid-area: icon;
        }

        toast > main > type{
          font-size: 20px;
          color: ${window.CSS.values.color.text.primary};
          text-transform: uppercase;
          font-weight: bold;
          grid-area: type;
        }

        toast > main > content{
          color: ${window.CSS.values.color.text.secondary};
          grid-area:content;
        }

        toast > dismiss{
          color: ${window.CSS.values.color.text.primary};
          font-size: 30px;
          user-select: none;

          width: 40px;
          height: 40px;

          border-radius: ${window.CSS.values.radius.default};

          display: grid;
          place-items: center;

          cursor: pointer;

          transition: ${window.CSS.values.transition.velocity} background-color;
        }

        toast > dismiss:hover{
          background-color: ${window.CSS.values.color.surface["4"]};
        }
        `;

        this.shadow.appendChild(style);

    }

    // Clone And Append Template
    this.shadow.appendChild(Toast.#template.content.cloneNode(true));

    // If typeName === TRUE Append Type Specific Icon Else Append "warning" Icon
    this.shadow.querySelector("toast>main>icon").innerHTML = !!ICONS[this.typeName] ? ICONS[this.typeName] : ICONS["warning"];

    // InnerHTML "typeName"
    this.shadow.querySelector("toast>main>type").innerHTML = window.Lang.use(this.typeName);

    // InnerHTML "textContent"
    this.shadow.querySelector("toast>main>content").innerHTML = window.Lang.use(this.textContent);

    // InnerHTML Close Button Icon
    this.shadow.querySelector("toast>dismiss").innerHTML = ICONS["close"];

    // Remove Toast On Click Dismiss
    // dismiss.onclick = ()=> this.remove(); // Bug w/ N sec removal
    this.shadow.querySelector("toast>dismiss").onclick = ()=> this.style.display = "none";

  }

  static new(type, content){
    if(!!type === false || !!content === false) return;


    document.querySelector(Toast.#selector).innerHTML += `<x-toast type="${type}">${content}</x-toast>`;

    // Auto Remove After N Seconds
    setTimeout(()=>{document.querySelector(Toast.#selector).firstChild?.remove();}, Toast.#autoDismissTimer);

  }
}
customElements.define('x-toast', Toast);

// Make Toast Usable W/O Importing It
window.Toast = Toast;
