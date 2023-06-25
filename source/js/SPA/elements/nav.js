// <x-nav class="box-default" selector="selector">
//   [
//     {"link": "overview"},
//     {"link": "details"},
//     {"link": "variants"},
//     {"link": "link", "name": "Name"}
//   ]
// </x-nav>

"use strict";

export default class Nav extends HTMLElement{
    static #template = document.createElement("template");

    static {
        Nav.#template.innerHTML = `<nav></nav>`;
    }

    constructor(){
        super();

        this.shadow = this.attachShadow({mode: 'closed'});

        // Selectir
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
                }
                nav > a{
                  background-color: var(--color-surface-5);
                  color: var(--color-text-primary);
                  text-align: center;
                  width: 100%;
                  padding: var(--padding);
                  border-radius: var(--radius);
                  transition: var(--transition-velocity) background-color ease-in-out;
                }
                nav > a:hover{
                  background-color: var(--color-surface-7);
                }
                nav > a.active{
                  background-color: var(--color-surface-7);
                }
            `;

            this.shadow.appendChild(style);

            // Set Nav Class
            this.shadow.querySelector("nav").setAttribute("class", this.getAttribute("class") || "box-default");

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
                    display: block;
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
