"use strict";

export default class Nav extends HTMLElement{
    static #template = document.createElement("template");

    static {
        Nav.#template.innerHTML = `<nav></nav>`;
    }

    constructor(){
        super();

        this.shadow = this.attachShadow({mode: 'closed'});

        // Selector
        this.selector = this.getAttribute("selector");

        // Clone And Append Template
        this.shadow.appendChild(Nav.#template.content.cloneNode(true));

        // background-color: var(--color-surface-4) !important;
        CSS: {
            const style = document.createElement('style');
            style.textContent = `
                ${window.CSS.rules.all}

                nav{
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: calc(var(--gap) / 2);
                  padding: var(--padding);

                  & > a{
                    background-color: var(--color-surface-1);

                    color: var(--color-text-primary);
                    text-align: center;
                    font-size: 0.8rem;

                    width: 100%;
                    min-width: max-content;

                    padding: var(--padding);
                    border-radius: var(--radius);

                    transition: var(--transition-velocity) ease-in-out;
                    transition-property: background-color, box-shadow;

                    &:hover{
                      background-color: var(--color-surface-4);
                      box-shadow: var(--shadow-default);
                    }

                    &.active{
                      background-color: var(--color-surface-4);
                      box-shadow: var(--shadow-default);
                    }
                  }
                }

                @media only screen and (max-width: ${CSS.values.screenSize.phone}){
                  nav{
                    max-width: calc(100vw - var(--padding) * 2);

                    flex-direction: row;
                    gap: calc(var(--gap) / 4);

                    & > a{
                      box-shadow: none !important;
                    }
                  }
                }

            `;

            this.shadow.appendChild(style);

            // Set Nav Class
            this.shadow.querySelector("nav").setAttribute("class", this.getAttribute("class") || "box-default");

            // Make scrollable on x axis when the media condition matches
            this.#ifMobileMakeScrollable();
            window.matchMedia(`(max-width: ${CSS.values.screenSize.phone})`).onchange = this.#ifMobileMakeScrollable;

        }

        BuildButtons: {
            this.buttonsHTML = "";
            this.buttons = JSON.parse(this.innerHTML).constructor === Array ? JSON.parse(this.innerHTML) : [];

            for(const button of this.buttons)
                this.buttonsHTML += `<a href="#${button.link}">${window.Lang.use("name" in button ? button.name : button.link)}</a>`;

        }

        // Content
        this.shadow.querySelector("nav").innerHTML = this.buttonsHTML;

        Listeners: {
            // Init Active Nav Button
            this.#setActive();

            // On Hash Change Trigger
            window.onhashchange = this.#setActive;

        }

    }

    #ifMobileMakeScrollable = ()=>{
      if(window.matchMedia(`(max-width: ${CSS.values.screenSize.phone})`).matches)
        this.shadow.querySelector("nav").classList.add("scrollbar-x");

      else this.shadow.querySelector("nav").classList.remove("scrollbar-x");
    }

    #setActive = ()=>{
        let isHashValid = false;
        const hyperlinks = this.shadow.querySelector("nav").getElementsByTagName("a");

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

            &:target{
              display: auto;
            }
          }
        `;
        document.head.appendChild(style);
    }

    disconnectedCallback(){
        document.head.removeChild(
            document.querySelector("style[for=x-nav]")
        );
    }

};

window.customElements.define('x-nav', Nav);

// Make Nav Usable W/O Importing It
window.Nav = Nav;
