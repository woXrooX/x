// <!-- HTML code -->
// <i class="search-icon"></i>
//
// <!-- CSS code -->
// .search-icon {
//   display: inline-block;
//   width: 24px;
//   height: 24px;
//   background-image: url('search-icon.svg');
//   background-size: cover;
// }

"use strict";

export default class Icon extends HTMLElement{
  static #template = document.createElement("template");

  static {
    El.#template.innerHTML = `
      <icon></icon>
    `;
  }

  constructor(){
    super();

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});

    // Clone And Append Template
    this.shadow.appendChild(Icon.#template.content.cloneNode(true));

    Content: {
      // this.textContent;
    }

    // CSS: {
    //   style.textContent = `
    //     icon{}
    //   `;
    //   this.shadow.appendChild(style);
    // }

    // Clone And Append Template
    this.shadow.appendChild(Toast.#template.content.cloneNode(true));

  }

};

window.customElements.define('x-icon', Icon);

// Make Icon Usable W/O Importing It
window.Icon = Icon;
