// const buttonStyles = `
//   background-color: blue;
//   color: white;
//   padding: 10px;
//   border-radius: 5px;
// `;
//
// const button = document.createElement('button');
// button.style.cssText = buttonStyles;
// button.textContent = 'Click me';
// document.body.appendChild(button);


// background -> middleground -> foreground
// Alias .color.brand -> .color.main

"use strict";

export default class CSS{
  static #mode = "dark";

  static val = {

    font: {
      size: {
        default: "15"     // px
      }
    },

    zIndex: {
      minus: -1,
      body: 1,
      footer: 2,
      main: 3,
      boxes: 4,
      header: 5,
      cover: 6,
      modal: 7,
      menu: 8,
      tooltip: 9,
      toasts: 10,
      loading: 11,
      urgent: 12
    },

    transition: {
      velocity: "200ms"
    },

    header: {
      height: "40px"
    },

    footer: {
      height: "80px"
    },

    padding: {
      default: "5px"
    },

    gap: {
      default: "20px"
    },

    radius: {
      default: "5px"
    },

    blur: {
      default: "10px"
    },

    screenSize: {
      phone: "600px",
      tablet: "768px",
      desktop: "992px",
      tv: "1200px"
    },

    color: {
      scheme: "dark light",

      success: "hsla(120, 100%, 25%, 1);",    // rgba(0, 128, 0, 1)
      info: "hsla(211.059, 100%, 50%, 1);",   // rgba(0, 123, 255, 1)
      warning: "hsla(46.286, 100%, 48%, 1);", // rgba(245, 189, 0, 1)
      error: "hsla(357.303, 82%, 57%, 1);",    // rgba(235, 57, 65, 1)

      cover: "rgba(0, 0, 0, 0.6)",

      science: {
        hue: 230,         // deg
        saturation: 13,   // %
        lightness: 9      // %
      }

    },

    shadow: {},

  };



  static {
    CSS.dark();
    // CSS.light();

    window.document.querySelector("style[for=INTERNAL_CSS]").innerText = CSS.master();

  }

  //////////// Modes
  static dark(){
    CSS.val.color.scheme = "dark";

    // The Color, Main Color, Brand Color
    CSS.val.color.main =
    CSS.val.color.brand = `
      hsla(
        ${CSS.val.color.science.hue}deg,
        ${CSS.val.color.science.saturation / 2}%,
        ${CSS.val.color.science.lightness / 2}%, 1);
    `;

    CSS.val.color.text = {
      primary: `hsla(${CSS.val.color.science.hue}deg, 15%, 95%, 1)`,
      secondary: `hsla(${CSS.val.color.science.hue}deg, 5%, 75%, 1)`,
      accent: `hsla(${CSS.val.color.science.hue}deg, ${CSS.val.color.science.saturation}%, 5%, 1)`
    };

    CSS.val.color.surface = {
      "1": `hsla(${CSS.val.color.science.hue}deg, 10%, 10%, 1)`,
      "2": `hsla(${CSS.val.color.science.hue}deg, 10%, 19.5%, 1)`,
      "3": `hsla(${CSS.val.color.science.hue}deg, 10%, 29%, 1)`,
      "4": `hsla(${CSS.val.color.science.hue}deg, 10%, 38.5%, 1)`,
      "5": `hsla(${CSS.val.color.science.hue}deg, 10%, 48%, 1)`,
      "6": `hsla(${CSS.val.color.science.hue}deg, 10%, 57.5%, 1)`,
      "7": `hsla(${CSS.val.color.science.hue}deg, 10%, 66.5%, 1)`,
      "8": `hsla(${CSS.val.color.science.hue}deg, 10%, 76%, 1)`,
      "9": `hsla(${CSS.val.color.science.hue}deg, 10%, 85.5%, 1)`,
      "10": `hsla(${CSS.val.color.science.hue}deg, 10%, 95%, 1)`,
    };

    CSS.val.shadow.default = `0px 10px 10px -5px hsla(${CSS.val.color.science.hue}deg 50% 3% / 0.3)`;

  }

  static light(){
    CSS.val.color.scheme = "light";

    // The Color, Main Color, Brand Color
    CSS.val.color.main =
    CSS.val.color.brand = `
      hsla(
        ${CSS.val.color.science.hue}deg,
        ${CSS.val.color.science.saturation / 2}%,
        ${CSS.val.color.science.lightness / 1.2}%, 1);
    `;


    CSS.val.color.text = {
      primary: `hsla(${CSS.val.color.science.hue}deg, ${CSS.val.color.science.saturation}%, 10%, 1)`,
      secondary: `hsla(${CSS.val.color.science.hue}deg, 30%, 30%, 1)`,
      accent: `hsla(${CSS.val.color.science.hue}deg, 15%, 95%, 1)`
    };

    CSS.val.color.surface = {
      "1": `hsla(${CSS.val.color.science.hue}, 20%, 100%, 1)`,
      "2": `hsla(${CSS.val.color.science.hue}, 20%, 89.5%, 1)`,
      "3": `hsla(${CSS.val.color.science.hue}, 20%, 79%, 1)`,
      "4": `hsla(${CSS.val.color.science.hue}, 20%, 68.5%, 1)`,
      "5": `hsla(${CSS.val.color.science.hue}, 20%, 58%, 1)`,
      "6": `hsla(${CSS.val.color.science.hue}, 20%, 47%, 1)`,
      "7": `hsla(${CSS.val.color.science.hue}, 20%, 36.5%, 1)`,
      "8": `hsla(${CSS.val.color.science.hue}, 20%, 26%, 1)`,
      "9": `hsla(${CSS.val.color.science.hue}, 20%, 15.5%, 1)`,
      "10": `hsla(${CSS.val.color.science.hue}, 20%, 15%, 1)`,
    };

    CSS.val.shadow.default = `0px 10px 10px -5px hsla(${CSS.val.color.science.hue}deg 10% 2% / 0.2)`;

  }

  //////////// Styles
  static master(){
    const all = `
      :root, html, body, *, *::before, *::after{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        outline: none;
        text-decoration: none;
        /* user-select: none; /* Disable copy */
        /* pointer-events: none; */

        -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* Mobile link click effect disabling */
        /* -webkit-tap-highlight-color: transparent; */
      }
    `;

    const scrollbar = `
      /* Removing Default Scroll Bar START */
      *{
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      *::-webkit-scrollbar{
        display:none;
      }
      /* Removing Default Scroll Bar END */
    `;

    const defaults = `
      body {
        background-color: ${CSS.val.color.surface["1"]};
        color: ${CSS.val.color.text.primary};
        font-family: Quicksand;
        font-size: 15px;

      }

      body > loading{
        background-color: ${CSS.val.color.surface["1"]};

        width: 100vw;
        height: 100vh;

        position: fixed;
        z-index: ${CSS.val.zIndex.loading};

        transition: ${CSS.val.transition.velocity} opacity ease-in-out;

      }
      body > loading::after{
        content: '';
        background-color: transparent;
        height: 20vh;
        width: 20vh;
        border-radius: 100%;
        border: 0px solid transparent;
        border-right: 2px solid ${CSS.val.color.text.primary};

        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transform-origin: center;

        animation: loading 500ms infinite ease-in-out;

      }
      @keyframes loading{
        0%{transform: translate(-50%, -50%) rotate(0deg);}
        100%{transform: translate(-50%, -50%) rotate(720deg);}

      }

      body > toasts{
        height: auto;
        max-height: 100vh;
        width: 400px;
        /* padding: ${CSS.val.padding.default}; */
        padding: 5px 5px 20px 5px;
        overflow-y: scroll;

        display: flex;
        flex-direction: column-reverse;
        gap: ${CSS.val.gap.default};

        /* pointer-events: none; */

        position: fixed;
        top: 0px;
        right: 0px;
        z-index: ${CSS.val.zIndex.toasts};

      }

      body > menu{
        --menu-background-color: hsla(${CSS.val.color.science.hue}, 5%, 20%, 1);
        background-color: var(--menu-background-color);
        height: 100vh;
        width: auto;

        overflow-y: scroll;

        display: grid;
        grid-template-rows: auto 2fr auto;
        justify-items: start;
        gap: ${CSS.val.gap.default};

        position: fixed;
        z-index: ${CSS.val.zIndex.menu};
        top: 0;
        left: 0;
        transform: translate(-100%, 0);
        transition-duration: ${CSS.val.transition.velocity};
        transition-timing-function: ease;
        transition-property: all;

      }

      body > menu > header{
        width: 100%;

        padding: calc(${CSS.val.padding.default} * 2);

        display: flex;
        flex-direction: row;
        justify-content: flex-end;

      }
      body > menu > header > div{
        user-select: none;

        width: 30px;
        height: 30px;
      }
      body > menu > main{
        width: 100%;
        padding: calc(${CSS.val.padding.default} * 2);

        display: flex;
        flex-direction: column;
        gap: calc(${CSS.val.gap.default} / 2);

      }
      body > menu > main > a{
        /* background-color: var(--menu-background-color); */

        /* filter: brightness(70%); */

        color: white;
        font-size: 2rem;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: ${CSS.val.gap.default};

        border: 1px solid transparent;
        border-radius: ${CSS.val.radius.default};
        padding: ${CSS.val.padding.default} calc(${CSS.val.padding.default} * 2);

        transition: ${CSS.val.transition.velocity} ease-in-out;
        transition-property: filter, background-color, border;

      }
      body > menu > main > a:where([active], :hover){
        background-color: var(--menu-background-color);
        filter: brightness(120%);

      }
      body > menu > main > a:where([active]){
        border: 1px solid white;

      }
      body > menu > main > a > x-icon{
        height: 40px;
        width: 40px;

      }

      body > menu > footer{}

      body > cover{
        pointer-events:auto;

        background: ${CSS.val.color.cover};
        backdrop-filter: blur(${CSS.val.blur.default});
        opacity: 0;
        width: 100vw;
        height: 100vh;

        position: fixed;
        z-index: ${CSS.val.zIndex.minus};

        transition: ${CSS.val.transition.velocity} opacity;

      }

      body > header{
        background-color: ${CSS.val.color.main};
        color: white;

        width: 100%;
        height: ${CSS.val.header.height};
        padding: ${CSS.val.padding.default};

        position: sticky;
        top: 0;
        left: 0;
        z-index: ${CSS.val.zIndex.header};

        display: grid;
        grid-template-columns: auto 3fr;

        place-items: center;

      }
      body > header > x-icon[for=menu]{
        height: calc(${CSS.val.header.height} - ${CSS.val.padding.default} * 2);
        width: calc(${CSS.val.header.height} - ${CSS.val.padding.default} * 2);

      }


      body > main {
        width: 100vw;
        min-height: calc(100vh - ${CSS.val.header.height} - ${CSS.val.footer.height});

      }

      body > footer {
        background-color: ${CSS.val.color.surface["2"]};
        color: ${CSS.val.color.text.primary};

        width: 100%;
        height: ${CSS.val.footer.height};
        padding: ${CSS.val.padding.default};

        display: grid;
        place-items: center;

      }

    `;

    return `
      ${all}
      ${scrollbar}
      ${defaults}

    `;
  }

  static common(){

    return ``;
  }

}

// Make CSS Usable W/O Importing It
window.CSS = CSS;
