"use strict";

export default class Nav extends HTMLElement{
    static #template = document.createElement("template");

    static {
        Nav.#template.innerHTML = `<nav></nav>`;
    }

    constructor(){
        super();

        // Save the JSON data
        this.JSON = this.innerHTML;

        // Clean the inner data
        this.innerHTML = "";

        // Selector
        this.selector = this.getAttribute("selector");

        // Clone And Append Template
        this.appendChild(Nav.#template.content.cloneNode(true));

        // Set Nav Class
        this.querySelector("nav").setAttribute("class", this.getAttribute("class") || "surface-clean");

        // Make scrollable on x axis when the media condition matches
        this.#ifMobileMakeScrollable();
        window.matchMedia(`(max-width: ${window.CSS.getValue("--screen-size-phone")})`).onchange = this.#ifMobileMakeScrollable;

        BuildButtons: {
            this.buttonsHTML = "";
            this.buttons = JSON.parse(this.JSON).constructor === Array ? JSON.parse(this.JSON) : [];

            for(const button of this.buttons)
                this.buttonsHTML += `<a href="#${button.link}">${window.Lang.use("name" in button ? button.name : button.link)}</a>`;

            // Placing the buttons/links
            this.querySelector("nav").innerHTML = this.buttonsHTML;
        }


        Listeners: {
            // Init Active Nav Button
            this.#setActive();

            // On Hash Change Trigger
            window.onhashchange = this.#setActive;
        }

    }

    #ifMobileMakeScrollable = ()=>{
      if(window.matchMedia(`(max-width: ${CSS.getValue("--screen-size-phone")})`).matches)
        this.querySelector("nav").classList.add("scrollbar-x");

      else this.querySelector("nav").classList.remove("scrollbar-x");
    }

    #setActive = ()=>{
        let isHashValid = false;
        const hyperlinks = this.querySelector("nav").getElementsByTagName("a");

        for(const a of hyperlinks)
            if(a.getAttribute("href") === window.location.hash){
                a.classList.add("active");

                isHashValid = true;

            }else a.classList.remove("active");

        // If Still No Valid Hash Found
        if(isHashValid === false){
            hyperlinks[0].classList.add("active");

            window.location.hash = hyperlinks[0].getAttribute("href");

        }



    };

    connectedCallback(){
        // CSS Rules For Child Elements Animation
        const style = document.createElement('style');
        style.setAttribute("for", "x-nav");
        style.innerText = `
          ${this.selector} > *[id]{
            scroll-margin-top: calc(var(--header-height) + (var(--padding) * 10));

            &:not(:target){
              display: none;
            }

            /* Acting like a remove css rule :)  */
            &:target{
              display: bugIsAFeature;
            }
          }

          @media only screen and (max-width: 600px){
            ${this.selector}{
              margin-top: calc(var(--header-height) + var(--padding));
            }
          }
        `;

        document.head.appendChild(style);
    }

    disconnectedCallback(){
        document.head.removeChild(document.querySelector("style[for=x-nav]"));
    }

};

window.customElements.define('x-nav', Nav);

// Make Nav Usable W/O Importing It
window.Nav = Nav;
