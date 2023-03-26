"use strict";

export default class Share extends HTMLElement{
  static #template = document.createElement("template");

  static {
    Share.#template.innerHTML = `
      <share>
        <x-icon>share</x-icon>
      </share>
    `;
  }

  constructor(){
    super();

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});

    Selector: {
      if(this.hasAttribute("selector"))
        this.selector = this.getAttribute("selector");

    }

    CSS: {
      const style = document.createElement('style');
      style.textContent = `
        share{
          width: 50px;
          height: 50px;
        }
      `;
      this.shadow.appendChild(style);
    }

    // Clone And Append Template
    this.shadow.appendChild(Share.#template.content.cloneNode(true));

    this.onclick = async ()=>{
      const shareData = {
        title: "MDN",
        text: "Learn web development on MDN!",
        url: "https://developer.mozilla.org",
      };

      // Check If navigator.share
      if(!!navigator.share === true)
        try{
          await navigator.share(shareData);
          console.log("MDN shared successfully");

        }catch(err){
          console.log(`Error: ${err}`);

        }

      else{
        console.log("No Native Support For 'navigator.share' On Your Device!");

        // Yzoken

      }


    };

  }

};

window.customElements.define('x-share', Share);

// Make Share Usable W/O Importing It
window.Share = Share;
