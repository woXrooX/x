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
  static modes = Object.freeze({
    DARK: 0,
    LIGHT: 1
  });

  static #currentMode = CSS.modes.DARK;

  static values = {

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
      scheme: null,

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

    CSS.switcher();

    // CSS.#dark();
    // CSS.light();

    window.document.querySelector("style[for=INTERNAL_CSS]").innerText = `
      ${CSS.common()}
      ${CSS.master()}
      ${CSS.styles()}
      ${CSS.layouts()}
    `;

  }

  //////////// APIs
  static switcher(mode = CSS.modes.DARK){
    switch(mode){
      case CSS.modes.DARK:
        CSS.#dark();
        console.log("Dark");
        break;

      case CSS.modes.LIGHT:
        CSS.#light();
        console.log("Light");
        break;

      default:
        CSS.#dark();
        console.log("Default");



    }
  }

  //////////// Modes
  static #dark(){
    CSS.values.color.scheme = "dark";

    // The Color, Main Color, Brand Color
    CSS.values.color.main =
    CSS.values.color.brand = `
      hsla(
        ${CSS.values.color.science.hue}deg,
        ${CSS.values.color.science.saturation / 2}%,
        ${CSS.values.color.science.lightness / 2}%, 1);
    `;

    CSS.values.color.text = {
      primary: `hsla(${CSS.values.color.science.hue}deg, 15%, 95%, 1)`,
      secondary: `hsla(${CSS.values.color.science.hue}deg, 5%, 75%, 1)`,
      accent: `hsla(${CSS.values.color.science.hue}deg, ${CSS.values.color.science.saturation}%, 5%, 1)`
    };

    CSS.values.color.surface = {
      "1": `hsla(${CSS.values.color.science.hue}deg, 10%, 10%, 1)`,
      "2": `hsla(${CSS.values.color.science.hue}deg, 10%, 15%, 1)`,
      "3": `hsla(${CSS.values.color.science.hue}deg, 10%, 20%, 1)`,
      "4": `hsla(${CSS.values.color.science.hue}deg, 10%, 25%, 1)`,
      "5": `hsla(${CSS.values.color.science.hue}deg, 10%, 30%, 1)`,
      "6": `hsla(${CSS.values.color.science.hue}deg, 10%, 35%, 1)`,
      "7": `hsla(${CSS.values.color.science.hue}deg, 10%, 50%, 1)`,
      "8": `hsla(${CSS.values.color.science.hue}deg, 10%, 65%, 1)`,
      "9": `hsla(${CSS.values.color.science.hue}deg, 10%, 80%, 1)`,
      "10": `hsla(${CSS.values.color.science.hue}deg, 10%, 95%, 1)`,
    };

    CSS.values.shadow.default = `0px 10px 10px -5px hsla(${CSS.values.color.science.hue}deg 50% 3% / 0.3)`;

  }

  static #light(){
    CSS.values.color.scheme = "light";

    // The Color, Main Color, Brand Color
    CSS.values.color.main =
    CSS.values.color.brand = `
      hsla(
        ${CSS.values.color.science.hue}deg,
        ${CSS.values.color.science.saturation / 2}%,
        ${CSS.values.color.science.lightness / 1.2}%, 1);
    `;


    CSS.values.color.text = {
      primary: `hsla(${CSS.values.color.science.hue}deg, ${CSS.values.color.science.saturation}%, 10%, 1)`,
      secondary: `hsla(${CSS.values.color.science.hue}deg, 30%, 30%, 1)`,
      accent: `hsla(${CSS.values.color.science.hue}deg, 15%, 95%, 1)`
    };

    CSS.values.color.surface = {
      "1": `hsla(${CSS.values.color.science.hue}, 20%, 100%, 1)`,
      "2": `hsla(${CSS.values.color.science.hue}, 20%, 95%, 1)`,
      "3": `hsla(${CSS.values.color.science.hue}, 20%, 90%, 1)`,
      "4": `hsla(${CSS.values.color.science.hue}, 20%, 85%, 1)`,
      "5": `hsla(${CSS.values.color.science.hue}, 20%, 80%, 1)`,
      "6": `hsla(${CSS.values.color.science.hue}, 20%, 75%, 1)`,
      "7": `hsla(${CSS.values.color.science.hue}, 20%, 60%, 1)`,
      "8": `hsla(${CSS.values.color.science.hue}, 20%, 45%, 1)`,
      "9": `hsla(${CSS.values.color.science.hue}, 20%, 30%, 1)`,
      "10": `hsla(${CSS.values.color.science.hue}, 20%, 15%, 1)`,
    };

    CSS.values.shadow.default = `0px 10px 10px -5px hsla(${CSS.values.color.science.hue}deg 10% 2% / 0.2)`;

  }

  //////////// Styles
  static common(){
    const fonts = `
      /*********************** FONTS START ***********************/

      @font-face{
        font-family: Quicksand;
        src:url("/fonts/Quicksand-Regular.ttf");
      }

      /*********************** FONTS END ***********************/
    `;

    return `
      ${fonts}
    `;

  }

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

    const skeleton = `
      :root{
        color-scheme: ${CSS.values.color.scheme};
        accent-color: ${CSS.values.color.main};
      }

      body {
        background-color: ${CSS.values.color.surface["1"]};
        color: ${CSS.values.color.text.primary};
        font-family: Quicksand;
        font-size: 15px;

      }

      body > loading{
        background-color: ${CSS.values.color.surface["1"]};

        width: 100vw;
        height: 100vh;

        position: fixed;
        z-index: ${CSS.values.zIndex.loading};

        transition: ${CSS.values.transition.velocity} opacity ease-in-out;

      }
      body > loading::after{
        content: '';
        background-color: transparent;
        height: 20vh;
        width: 20vh;
        border-radius: 100%;
        border: 0px solid transparent;
        border-right: 2px solid ${CSS.values.color.text.primary};

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
        /* padding: ${CSS.values.padding.default}; */
        padding: 5px 5px 20px 5px;
        overflow-y: scroll;

        display: flex;
        flex-direction: column-reverse;
        gap: ${CSS.values.gap.default};

        /* pointer-events: none; */

        position: fixed;
        top: 0px;
        right: 0px;
        z-index: ${CSS.values.zIndex.toasts};

      }

      body > menu{
        --menu-background-color: hsla(${CSS.values.color.science.hue}, 5%, 20%, 1);
        background-color: var(--menu-background-color);
        height: 100vh;
        width: auto;

        overflow-y: scroll;

        display: grid;
        grid-template-rows: auto 2fr auto;
        justify-items: start;
        gap: ${CSS.values.gap.default};

        position: fixed;
        z-index: ${CSS.values.zIndex.menu};
        top: 0;
        left: 0;
        transform: translate(-100%, 0);
        transition-duration: ${CSS.values.transition.velocity};
        transition-timing-function: ease;
        transition-property: all;

      }

      body > menu > header{
        width: 100%;

        padding: calc(${CSS.values.padding.default} * 2);

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
        padding: calc(${CSS.values.padding.default} * 2);

        display: flex;
        flex-direction: column;
        gap: calc(${CSS.values.gap.default} / 2);

      }
      body > menu > main > a{
        /* background-color: var(--menu-background-color); */

        /* filter: brightness(70%); */

        color: white;
        font-size: 2rem;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: ${CSS.values.gap.default};

        border: 1px solid transparent;
        border-radius: ${CSS.values.radius.default};
        padding: ${CSS.values.padding.default} calc(${CSS.values.padding.default} * 2);

        transition: ${CSS.values.transition.velocity} ease-in-out;
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

        background: ${CSS.values.color.cover};
        backdrop-filter: blur(${CSS.values.blur.default});
        opacity: 0;
        width: 100vw;
        height: 100vh;

        position: fixed;
        z-index: ${CSS.values.zIndex.minus};

        transition: ${CSS.values.transition.velocity} opacity;

      }

      body > header{
        background-color: ${CSS.values.color.main};
        color: white;

        width: 100%;
        height: ${CSS.values.header.height};
        padding: ${CSS.values.padding.default};

        position: sticky;
        top: 0;
        left: 0;
        z-index: ${CSS.values.zIndex.header};

        display: grid;
        grid-template-columns: auto 3fr;

        place-items: center;

      }
      body > header > x-icon[for=menu]{
        height: calc(${CSS.values.header.height} - ${CSS.values.padding.default} * 2);
        width: calc(${CSS.values.header.height} - ${CSS.values.padding.default} * 2);

      }


      body > main {
        width: 100vw;
        min-height: calc(100vh - ${CSS.values.header.height} - ${CSS.values.footer.height});

      }

      body > footer {
        background-color: ${CSS.values.color.surface["2"]};
        color: ${CSS.values.color.text.primary};

        width: 100%;
        height: ${CSS.values.footer.height};
        padding: ${CSS.values.padding.default};

        display: grid;
        place-items: center;

      }

    `;

    const defaults = `
      /****************************** SVG START ******************************/
      svg{
        cursor: pointer;
      }
      /****************************** SVG END ******************************/

      /****************************** hr START ******************************/
      hr{
        border:none;
        border-top:1px solid ${CSS.values.color.text.secondary};
      }
      /****************************** hr END ******************************/

      /****************************** a START ******************************/
      a{
        color: ${CSS.values.color.text.secondary};
        cursor: pointer;
      }
      a:where(:active, :focus, :hover){
        color: ${CSS.values.color.text.primary};
      }
      /****************************** a END ******************************/

      /****************************** Info, Success, Warning, Error START ******************************/
      success{
        color: ${CSS.values.color.success};
      }
      success::before{
        content:"\\2713";
      }

      info{
        color: ${CSS.values.color.info};
      }
      info::before{
        content:"\\2139";
      }

      warning{
        color: ${CSS.values.color.warning};
      }
      warning::before{
        content:"\\26A0";
      }

      error{
        color: ${CSS.values.color.error};
      }
      error::before{
        content: "\\2715";
      }

      info::before,
      success::before,
      warning::before,
      error::before{
        margin-right:5px;
      }

      success:empty,
      warning:empty,
      error:empty{
        display:none;
      }

      /****************************** Info, Success, Warning, Error END ******************************/

      /****************************** Disabled START ******************************/
      *:disabled,
      input[type=submit]:disabled,
      input[type=file]:disabled::file-selector-button{
        cursor: not-allowed;
        opacity: 0.5;

      }
      /****************************** Disabled END ******************************/
    `;

    return `
      ${all}
      ${scrollbar}
      ${skeleton}
      ${defaults}
    `;

  }

  static styles(){
    const form = `
      /****************************** Form START ******************************/

      /************ Form START ************/
      form{
        --f-padding: 10px;
        --f-radius: 5px;
        --f-gap: 10px;
        --f-height: 40px;
        --f-width: 100%;
        --f-font-size: 20px;
        --f-border: 1px solid ${CSS.values.color.text.secondary};
        --f-transition: ${CSS.values.transition.velocity} ease-in-out;
        --f-transition-property: background-color, border;

        width: var(--f-width);

        display: grid;
        grid-gap: var(--f-gap);

      }
      /************ Form END ************/

      /************ Autofill START ************/
      /* input:-webkit-autofill */
      /* -webkit-text-fill-color: yellow !important; */

      input:-webkit-autofill,
      input:autofill{
        /* background-color: red !important; */
        /* -webkit-text-fill-color: red !important; */
      }
      /************ Autofill END ************/

      /************ fieldset START ************/
      form fieldset{
        padding: var(--f-padding);
        border-radius: var(--f-radius);
        border: var(--f-border);

        display: flex;
        flex-direction: column;
        gap: var(--f-gap);

      }
      /************ fieldset END ************/

      /************ fieldset > legend START ************/
      form fieldset legend{
        background-color: ${CSS.values.color.text.primary};
        color: ${CSS.values.color.text.accent};
        border-radius: var(--f-radius);
        padding: 2px 5px;

      }
      /************ fieldset > legend END ************/

      /************ label START ************/
      form label{
      }
      /************ label START ************/

      /************ label > p START ************/
      form label > p{
        height: 2em;
        display: flex;
        flex-direction: row;
      }
      /************ label > p START ************/

      /************ select, textarea, imput -> type = [text, password, eMail, number, color, file, date] START ************/
      select,
      textarea,
      input:where([type=text], [type=eMail], [type=password], [type=number], [type=color], [type=file], [type=date]){
        background-color: ${CSS.values.color.surface["3"]};
        width: var(--f-width);
        height: var(--f-height);
        font-size: var(--f-font-size);
        padding: 0 var(--f-padding);
        border-radius: var(--f-radius);
        border: var(--f-border);

        transition: var(--f-transition);
        transition-property: var(--f-transition-property);

      }
      /************ select, textarea, imput -> type = [text, password, eMail, number, color, file, date] END ************/

      /************ :hover & :focus -> inputs & textarea & select START ************/
      select:not(:disabled):where(:hover, :focus),
      textarea:not(:disabled):where(:hover, :focus),
      input[type=number]:not(:disabled):where(:hover, :focus),
      input:not(:disabled):where(:hover, :focus){
        background-color: ${CSS.values.color.surface["5"]};
        border: 1px solid ${CSS.values.color.text.primary};

      }
      /************ :hover & :focus -> inputs & textarea & select END ************/

      /************ Textarea START ************/
      textarea{
        height: unset;
        font-size: calc(var(--f-font-size) / 1.5);
        min-height: 150px;
        resize: vertical;
        padding: var(--f-padding);

      }
      /************ Textarea END ************/

      /************ input[type=color] START ************/
      /* form input[type=color]{-webkit-appearance: none;} */

      /* Chrome X */
      input[type=color]::-webkit-color-swatch-wrapper{
        padding: 5px;
        width: var(--f-width);

      }

      /* Chrome Y */
      input[type=color]::-webkit-color-swatch{
        border: none;
        border-radius: var(--f-radius);
        height: 100%;

      }

      /* Firefox X */
      input[type=color]::-moz-color-swatch-wrapper {
        padding: 5px;
        width: var(--f-width);

      }

      /* Firefox Y */
      input[type=color]::-moz-color-swatch{
        border: none;
        border-radius: var(--f-radius);
        height: 100%;

      }
      /************ input[type=color] END ************/

      /************ input[type=file] START ************/

      /* Input */
      input[type=file]{
        padding: ${CSS.values.padding.default};
        font-size: var(--f-font-size);

      }

      /* File Button */
      input[type=file]::file-selector-button{
        background-color: ${CSS.values.color.main};
        color: white;
        font-size: var(--f-font-size);

        padding: 3px 10px;

        border: none;
        border-radius: var(--f-radius);

        cursor: pointer;

        filter: brightness(120%);
        transition: ${CSS.values.transition.velocity} filter;

      }

      /* File Button :hover */
      input[type=file]::file-selector-button:not(:disabled):hover{
        filter: brightness(80%);

      }
      /************ input[type=file] END ************/

      /************ input[type=number] Hide Arrow START ************/
      /* Firefox */
      input[type=number]{-moz-appearance: textfield;}

      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button{-webkit-appearance: none;}
      /************ input[type=number] END ************/

      /************ input[type=radio] & input[type=checkbox] START ************/
      input:where([type=radio], [type=checkbox]){
        width: 20px;
        height: auto;

      }
      /************ input[type=radio] & input[type=checkbox] END ************/

      /************ select hide arrow START ************/
      /* form :not(input:where([type=radio], [type=checkbox])), */
      select{
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;

      }
      /************ select hide arrow END ************/

      /************ input[type=submit] & button START ************/
      button,
      input[type=submit]{
        background-color: ${CSS.values.color.main};
        color: white;
        overflow: hidden;
        width: auto;
        height: var(--f-height);
        padding: 0px var(--f-padding);
        border-radius: var(--f-radius);
        border: none;
        text-transform: uppercase;

        cursor: pointer;

        filter: brightness(120%);
        transition: ${CSS.values.transition.velocity} filter;

      }

      button:not(:disabled):where(:active, :focus, :hover),
      input[type=submit]:not(:disabled):where(:active, :focus, :hover){
        filter: brightness(80%);
      }

      /************ input[type=submit] & button END ************/

      /****************************** Form END ******************************/
    `;

    const table = `
      /****************************** Table START ******************************/

      /************ Table START ************/
      table{
        --table-radius: 3px;

        /* make table cells with same */
        table-layout: fixed;

        width: 100%;
        border: 1px solid ${CSS.values.color.main};
        border-radius: ${CSS.values.radius.default};
        padding: ${CSS.values.padding.default};

      }
      /************ Table END ************/

      /************ thead START ************/
      table > thead{
        background-color: ${CSS.values.color.surface["10"]};
      }

      table > thead > tr > th{
        color: ${CSS.values.color.text.accent};
        font-weight: bold;

        border-radius: var(--table-radius);
        padding: ${CSS.values.padding.default};

      }
      /************ thead END ************/

      /************ tbody START ************/
      table > tbody > tr:nth-child(odd){
        background-color: ${CSS.values.color.surface["3"]};

      }
      table > tbody > tr:nth-child(even){
        background-color: ${CSS.values.color.surface["4"]};

      }

      table > tbody > tr > td{
        border-radius: var(--table-radius);
        padding: ${CSS.values.padding.default};

      }

      /* tr:hover START */
      table > tbody > tr{
        transition: ${CSS.values.transition.velocity} ease-in-out background-color;
      }

      table > tbody > tr:hover{
        background-color: ${CSS.values.color.surface["7"]};
      }
      /* tr:hover END */

      /************ tbody END ************/

      /************ tfead START ************/
      table > tfoot{
        background-color: ${CSS.values.color.surface["9"]};
      }

      table > tfoot > tr > td{
        color: ${CSS.values.color.text.accent};

        border-radius: var(--table-radius);
        padding: ${CSS.values.padding.default};

      }
      /************ tfoot END ************/

      /****************************** Table END ******************************/
    `;

    return `
      ${form}
      ${table}
    `;

  }

  static layouts(){
    const boxes = `
      /*********************** Themed Boxes START ***********************/
      /* Default */
      .box-default{
        background-color: ${CSS.values.color.surface["3"]};

        border-radius: ${CSS.values.radius.default};
        box-shadow: ${CSS.values.shadow.default};

      }

      /* 2D */
      .box-2D{
        background-color: ${CSS.values.color.surface["3"]};

        border-radius: 0px;
        border-left: 1px solid ${CSS.values.color.surface["2"]};
        border-top: 1px solid ${CSS.values.color.surface["4"]};
        border-right: 1px solid ${CSS.values.color.surface["4"]};
        border-bottom: 1px solid ${CSS.values.color.surface["2"]};

      }

      /* round */
      .box-round{
        background-color: ${CSS.values.color.surface["3"]};
        border-radius: calc(${CSS.values.radius.default} * 6);
        box-shadow: 0px 19px 15px -10px rgba(0, 0, 0, 0.3);

      }
      /*********************** Themed Boxes END ***********************/
    `;

    const layoutSystem = `
      /*********************** Layout System START ***********************/
      container{
        /* border: 1px green solid; */

        display: grid;
        place-items: center;

        width: 100%;

      }

      row, column{
        display: flex;
        /* gap: ${CSS.values.gap.default}; */

      }

      row{
        /* border: 1px red solid; */

        /* background-color: ${CSS.values.color.surface["3"]}; */
        width: 100%;

        flex-direction: row;
        justify-content: center;
        /* align-items: center; */

      }

      column{
        /* border: 1px pink solid; */

        /* background-color: ${CSS.values.color.surface["4"]}; */
        width: auto;

        flex-direction: column;
        /* justify-content: center; */
        align-items: center;

      }

      /* Widths START */
      .w-10{width: 10%;}
      .w-15{width: 15%;}
      .w-20{width: 20%;}
      .w-25{width: 25%;}
      .w-30{width: 30%;}
      .w-35{width: 35%;}
      .w-40{width: 40%;}
      .w-45{width: 45%;}
      .w-50{width: 50%;}
      .w-55{width: 55%;}
      .w-60{width: 60%;}
      .w-65{width: 65%;}
      .w-70{width: 70%;}
      .w-75{width: 75%;}
      .w-80{width: 80%;}
      .w-85{width: 85%;}
      .w-90{width: 90%;}
      .w-95{width: 95%;}
      .w-100{width: 100%;}
      /* Widths END */

      /***** Paddings START *****/

      .p-1{padding: ${CSS.values.padding.default};}
      .p-2{padding: calc(${CSS.values.padding.default} * 2);}
      .p-3{padding: calc(${CSS.values.padding.default} * 3);}
      .p-4{padding: calc(${CSS.values.padding.default} * 4);}
      .p-5{padding: calc(${CSS.values.padding.default} * 5);}

      /* Top */
      .p-t-1{padding-top: ${CSS.values.padding.default};}
      .p-t-2{padding-top: calc(${CSS.values.padding.default} * 2);}
      .p-t-3{padding-top: calc(${CSS.values.padding.default} * 3);}
      .p-t-4{padding-top: calc(${CSS.values.padding.default} * 4);}
      .p-t-5{padding-top: calc(${CSS.values.padding.default} * 5);}

      /* Right */
      .p-r-1{padding-right: ${CSS.values.padding.default};}
      .p-r-2{padding-right: calc(${CSS.values.padding.default} * 2);}
      .p-r-3{padding-right: calc(${CSS.values.padding.default} * 3);}
      .p-r-4{padding-right: calc(${CSS.values.padding.default} * 4);}
      .p-r-5{padding-right: calc(${CSS.values.padding.default} * 5);}

      /* Bottom */
      .p-b-1{padding-bottom: ${CSS.values.padding.default};}
      .p-b-2{padding-bottom: calc(${CSS.values.padding.default} * 2);}
      .p-b-3{padding-bottom: calc(${CSS.values.padding.default} * 3);}
      .p-b-4{padding-bottom: calc(${CSS.values.padding.default} * 4);}
      .p-b-5{padding-bottom: calc(${CSS.values.padding.default} * 5);}

      /* Left */
      .p-l-1{padding-left: ${CSS.values.padding.default};}
      .p-l-2{padding-left: calc(${CSS.values.padding.default} * 2);}
      .p-l-3{padding-left: calc(${CSS.values.padding.default} * 3);}
      .p-l-4{padding-left: calc(${CSS.values.padding.default} * 4);}
      .p-l-5{padding-left: calc(${CSS.values.padding.default} * 5);}

      /***** Paddings END *****/

      /***** Margings START *****/

      .m-1{margin: ${CSS.values.padding.default};}
      .m-2{margin: calc(${CSS.values.padding.default} * 2);}
      .m-3{margin: calc(${CSS.values.padding.default} * 3);}
      .m-4{margin: calc(${CSS.values.padding.default} * 4);}
      .m-5{margin: calc(${CSS.values.padding.default} * 5);}

      /* Top */
      .m-t-1{margin-top: ${CSS.values.padding.default};}
      .m-t-2{margin-top: calc(${CSS.values.padding.default} * 2);}
      .m-t-3{margin-top: calc(${CSS.values.padding.default} * 3);}
      .m-t-4{margin-top: calc(${CSS.values.padding.default} * 4);}
      .m-t-5{margin-top: calc(${CSS.values.padding.default} * 5);}

      /* Right */
      .m-r-1{margin-right: ${CSS.values.padding.default};}
      .m-r-2{margin-right: calc(${CSS.values.padding.default} * 2);}
      .m-r-3{margin-right: calc(${CSS.values.padding.default} * 3);}
      .m-r-4{margin-right: calc(${CSS.values.padding.default} * 4);}
      .m-r-5{margin-right: calc(${CSS.values.padding.default} * 5);}

      /* Bottom */
      .m-b-1{margin-bottom: ${CSS.values.padding.default};}
      .m-b-2{margin-bottom: calc(${CSS.values.padding.default} * 2);}
      .m-b-3{margin-bottom: calc(${CSS.values.padding.default} * 3);}
      .m-b-4{margin-bottom: calc(${CSS.values.padding.default} * 4);}
      .m-b-5{margin-bottom: calc(${CSS.values.padding.default} * 5);}

      /* Left */
      .m-l-1{margin-left: ${CSS.values.padding.default};}
      .m-l-2{margin-left: calc(${CSS.values.padding.default} * 2);}
      .m-l-3{margin-left: calc(${CSS.values.padding.default} * 3);}
      .m-l-4{margin-left: calc(${CSS.values.padding.default} * 4);}
      .m-l-5{margin-left: calc(${CSS.values.padding.default} * 5);}

      /***** Margings END *****/

      /***** Gap START *****/

      .g-1{gap: ${CSS.values.gap.default};}
      .g-2{gap: calc(${CSS.values.gap.default} * 2);}
      .g-3{gap: calc(${CSS.values.gap.default} * 3);}
      .g-4{gap: calc(${CSS.values.gap.default} * 4);}
      .g-5{gap: calc(${CSS.values.gap.default} * 5);}

      /***** Gap END *****/

      /* Placing START */
      .right{
        text-align: right;
        align-items: flex-end;
        place-items: right;
        justify-content: flex-end;

      }

      .center{
        text-align: center;
        align-items: center;
        place-items: center;
        justify-content: center;

      }

      .left{
        text-align: left;
        align-items: flex-start;
        place-items: left;
        justify-content: flex-start;

      }
      /* Placing END */

      /* Radiuses START */
      .radius{border-radius: ${CSS.values.radius.default};}
      /* Radiuses END */

      /* Background Shadow START */
      .bs{box-shadow: ${CSS.values.shadow.default};}
      /* Background Shadow END */

      /* Background Colors START */
      .bc-1{background-color: ${CSS.values.color.surface["1"]};}
      .bc-2{background-color: ${CSS.values.color.surface["2"]};}
      .bc-3{background-color: ${CSS.values.color.surface["3"]};}
      .bc-4{background-color: ${CSS.values.color.surface["4"]};}
      .bc-5{background-color: ${CSS.values.color.surface["5"]};}
      .bc-6{background-color: ${CSS.values.color.surface["6"]};}
      .bc-7{background-color: ${CSS.values.color.surface["7"]};}
      .bc-8{background-color: ${CSS.values.color.surface["8"]};}
      .bc-9{background-color: ${CSS.values.color.surface["9"]};}
      .bc-10{background-color: ${CSS.values.color.surface["10"]};}

      .bc-g-right{background-image: linear-gradient(to right, ${CSS.values.color.surface["2"]} , ${CSS.values.color.surface["6"]});}
      .bc-g-left{background-image: linear-gradient(to left, ${CSS.values.color.surface["2"]} , ${CSS.values.color.surface["6"]});}
      .bc-g-45{background-image: linear-gradient(45deg, ${CSS.values.color.surface["2"]}, ${CSS.values.color.surface["6"]} 80%);}
      /* Background Colors END */

      /*********************** Layout System END ***********************/
    `;

    return `
      ${boxes}
      ${layoutSystem}
    `;

  }

}

// Make CSS Usable W/O Importing It
window.CSS = CSS;
