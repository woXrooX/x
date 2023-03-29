"use strict";

export default class Share extends HTMLElement{
  static #template = document.createElement("template");

  static {
    Share.#template.innerHTML = `
      <share>
        <x-icon>share</x-icon>
        <section for="modal"></section>
      </share>
    `;
  }

  constructor(){
    super();

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});

    Text: {
      this.textToShare = null;
      if(!!this.getAttribute("selector") === true) this.textToShare = this.getAttribute("selector");
      else if(!!this.getAttribute("text") === true) this.textToShare = this.getAttribute("text");


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

    this.shadow.querySelector("x-icon").onclick = async ()=>{

      const shareData = {
        title: this.getAttribute("title") || document.title,
        text: this.textToShare || window.Lang.use("shareDefaultText"),
        url: this.getAttribute("url") || window.location.href,
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

        this.shadow.querySelector("section").innerHTML = `
          <x-modal trigger="auto">

            <a href="https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.text}" target="_blank">
              <x-icon>twitter_original</x-icon>
            </a>

            <a href="https://www.facebook.com/sharer.php?u=${shareData.url}&quote=${shareData.text}" target="_blank">
              <x-icon>facebook_original</x-icon>
            </a>

            <a href="https://www.linkedin.com/shareArticle?url=${shareData.url}&title=${shareData.title}&summary=${shareData.text}" target="_blank">
              <x-icon>linkedin_original</x-icon>
            </a>

            <a href="https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.text}" target="_blank">
              <x-icon>instagram_original</x-icon>
            </a>

          </x-modal>
        `;

      }


    };

  }

};

window.customElements.define('x-share', Share);

// Make Share Usable W/O Importing It
window.Share = Share;
