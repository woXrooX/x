"use strict";

export default class Nav extends HTMLElement{
    constructor(){
        super();

        // Save the JSON data
        this.JSON = this.innerHTML;

        // Clean the inner data
        this.innerHTML = `<nav class="w-100 d-flex flex-column text-left gap-0-2 p-1"></nav>`;

        // Check if this has "selector" attribute
        if(this.hasAttribute("selector") === false) return;
        this.selector = this.getAttribute("selector");

        // Set nav class
        this.querySelector("nav").classList.add(this.getAttribute("class") || "surface-clean");

        BuildHTML: {
          this.HTML = "";
          this.JSON = JSON.parse(this.JSON).constructor === Array ? JSON.parse(this.JSON) : [];

          this.#buildNavs(this.JSON);

          // Placing the buttons/links
          this.querySelector("nav").innerHTML = this.HTML;
        }


        Listeners: {
          // Make scrollable on x axis when the media condition matches
          this.#ifMobileMakeScrollable();
          window.matchMedia(`(max-width: ${window.CSS.getValue("--screen-size-phone")})`).onchange = this.#ifMobileMakeScrollable;

          // Init Active Nav Button
          this.#setActive();

          // On Hash Change Trigger
          window.onhashchange = this.#setActive;

          this.#toggleSubNav();
        }
    }

    #buildNavs = (data)=>{
      for(const obj of data){
        if("link" in obj){
          this.HTML += `
            <div class="w-100 d-flex flex-column gap-0-2 pl-3 p-1 radius-default">
              <section for="link">
                ${"subNav" in obj ? '<x-icon name="arrow_bottom_small" for="toggleSubNav"></x-icon>' : "<span></span>"}
                <a href="#${obj.link}">${window.Lang.use("name" in obj ? obj.name : obj.link)}</a>
              </section>
          `;

          if("subNav" in obj){
            this.HTML += `<section for="subNav" class="d-flex flex-column gap-0-2 radius-default">`;
            this.#buildNavs(obj.subNav);
            this.HTML += `</section>`;
          }

          this.HTML += `</div>`;
        }
      }
    }

    #ifMobileMakeScrollable = ()=>{
      if(window.matchMedia(`(max-width: ${CSS.getValue("--screen-size-phone")})`).matches)
        this.querySelector("nav").classList.add("scrollbar-x");

      else this.querySelector("nav").classList.remove("scrollbar-x");
    }

    #toggleSubNav = ()=>{
      const subNavTogglers = this.querySelectorAll("x-icon[for=toggleSubNav]");

      for(const toggler of subNavTogglers)
        toggler.onclick = ()=> {
          toggler.classList.toggle("open");
          toggler.parentElement.parentElement.querySelector("section[for=subNav]").classList.toggle("show");
        }
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
    }

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
