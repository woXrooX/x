// OG Importing Way Of The CSS Files
// <link rel="preload" href="{{url_for('static', filename='css/master.css')}}" as="style">
// <link rel="stylesheet" type="text/css" href="{{url_for('static', filename='css/master.css')}}">

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
  // Color Modes
  static colorModes = Object.freeze({
    DARK: 1,
    LIGHT: 2
  });

  // Color Mode Default: Dark Mode
  static currentColorMode = CSS.colorModes.DARK;

  // Values
  static values = {

    document: {},

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

      brand: {},

      text: {}

    },

    shadow: {},

  };

  // Rules
  static rules = {};

  //////////// APIs
  ///// Init
  static init(){
    CSS.#calculateDocumentHeight();

    CSS.#loadColorBrand();

    CSS.detectColorMode();

  }

  ///// Color Mode
  // Detect Color Mode
  static detectColorMode(){
    // Get User Preferred Color Mode
    if(
      // If User Is In Session
      "user" in window.session &&

      // If Session User Has "app_color_mode"
      "app_color_mode" in window.session["user"] &&

      // If "app_color_mode" Is In CSS.colorModes
      Object.values(CSS.colorModes).includes(window.session["user"]["app_color_mode"])
    )
      CSS.currentColorMode = window.session["user"]["app_color_mode"];

    // Get System Color Mode
    else if(window.matchMedia){
      // System Default: Dark
      if(window.matchMedia('(prefers-color-scheme: dark)').matches) CSS.currentColorMode = CSS.colorModes.DARK;

      // System Default: Light
      else CSS.currentColorMode = CSS.colorModes.LIGHT;

    }

    // Update The Colors According To Color Mode
    CSS.colorModeSwitcher();

  }

  // Color Mode Switcher
  static colorModeSwitcher(){
    switch(CSS.currentColorMode){
      case CSS.colorModes.DARK:
        // console.log("Dark");
        CSS.#dark();
        CSS.currentColorMode = CSS.colorModes.DARK;
        break;

      case CSS.colorModes.LIGHT:
        // console.log("Light");
        CSS.#light();
        CSS.currentColorMode = CSS.colorModes.LIGHT;
        break;

      default:
        // console.log("Default");
        CSS.#dark();
        CSS.currentColorMode = CSS.colorModes.DARK;

    }

    // After Color Mode Selection Update The Rules
    CSS.#update();

  }

  ///// Document Height
  // Calculate Document Height
  static #calculateDocumentHeight(){
    // Set Document Height For THe First Time
    CSS.#setDocumentHeight();

    // Update Document Height On Resize
    window.addEventListener("resize", CSS.#setDocumentHeight);

  }

  // Set Document Height
  static #setDocumentHeight(){
    // Set Document Height
    CSS.values.document.height = `${window.innerHeight}px`;

  }

  ///// Load Brand Color From Configurations File
  static #loadColorBrand(){
    CSS.values.color.brand = {
      hue: window.CONF.default.color.brand.hue || 230,
      saturation: window.CONF.default.color.brand.saturation || 13,
      lightness: window.CONF.default.color.brand.lightness || 9
    }
  }

  ///// Updates The CSS Rules
  static #update(){
    CSS.rules.all = `
      ${CSS.common()}
      ${CSS.master()}
      ${CSS.styles()}
      ${CSS.layouts()}
    `;

    window.document.querySelector("style[for=X_CSS]").innerText = CSS.rules.all;
  }


  //////////// Modes
  static #dark(){
    CSS.values.color.scheme = "dark";

    // The Color, Main Color, Brand Color
    CSS.values.color.main = `
      hsla(
        ${CSS.values.color.brand.hue}deg,
        ${CSS.values.color.brand.saturation}%,
        ${CSS.values.color.brand.lightness}%, 1);
    `;

    CSS.values.color.text = {
      primary: `hsla(${CSS.values.color.brand.hue}deg, 15%, 95%, 1)`,
      secondary: `hsla(${CSS.values.color.brand.hue}deg, 5%, 75%, 1)`,
      accent: `hsla(${CSS.values.color.brand.hue}deg, ${CSS.values.color.brand.saturation}%, 5%, 1)`
    };

    CSS.values.color.surface = {
      "1": `hsla(${CSS.values.color.brand.hue}deg, 10%, 10%, 1)`,
      "2": `hsla(${CSS.values.color.brand.hue}deg, 10%, 15%, 1)`,
      "3": `hsla(${CSS.values.color.brand.hue}deg, 10%, 20%, 1)`,
      "4": `hsla(${CSS.values.color.brand.hue}deg, 10%, 25%, 1)`,
      "5": `hsla(${CSS.values.color.brand.hue}deg, 10%, 30%, 1)`,
      "6": `hsla(${CSS.values.color.brand.hue}deg, 10%, 35%, 1)`,
      "7": `hsla(${CSS.values.color.brand.hue}deg, 10%, 50%, 1)`,
      "8": `hsla(${CSS.values.color.brand.hue}deg, 10%, 65%, 1)`,
      "9": `hsla(${CSS.values.color.brand.hue}deg, 10%, 80%, 1)`,
      "10": `hsla(${CSS.values.color.brand.hue}deg, 10%, 95%, 1)`,
    };

    CSS.values.shadow.default = `0px 10px 10px -5px hsla(${CSS.values.color.brand.hue}deg 50% 3% / 0.3)`;

  }

  static #light(){
    CSS.values.color.scheme = "light";

    // The Color, Main Color, Brand Color
    CSS.values.color.main = `
      hsla(
        ${CSS.values.color.brand.hue}deg,
        ${CSS.values.color.brand.saturation}%,
        ${CSS.values.color.brand.lightness}%, 1);
    `;


    CSS.values.color.text = {
      primary: `hsla(${CSS.values.color.brand.hue}deg, ${CSS.values.color.brand.saturation}%, 10%, 1)`,
      secondary: `hsla(${CSS.values.color.brand.hue}deg, 30%, 30%, 1)`,
      accent: `hsla(${CSS.values.color.brand.hue}deg, 15%, 95%, 1)`
    };

    CSS.values.color.surface = {
      "1": `hsla(${CSS.values.color.brand.hue}, 20%, 100%, 1)`,
      "2": `hsla(${CSS.values.color.brand.hue}, 20%, 95%, 1)`,
      "3": `hsla(${CSS.values.color.brand.hue}, 20%, 90%, 1)`,
      "4": `hsla(${CSS.values.color.brand.hue}, 20%, 85%, 1)`,
      "5": `hsla(${CSS.values.color.brand.hue}, 20%, 80%, 1)`,
      "6": `hsla(${CSS.values.color.brand.hue}, 20%, 75%, 1)`,
      "7": `hsla(${CSS.values.color.brand.hue}, 20%, 60%, 1)`,
      "8": `hsla(${CSS.values.color.brand.hue}, 20%, 45%, 1)`,
      "9": `hsla(${CSS.values.color.brand.hue}, 20%, 30%, 1)`,
      "10": `hsla(${CSS.values.color.brand.hue}, 20%, 15%, 1)`,
    };

    CSS.values.shadow.default = `0px 10px 10px -5px hsla(${CSS.values.color.brand.hue}deg 10% 2% / 0.2)`;

  }

  //////////// CSS
  static common(){
    CSS.rules.fonts = `
      /*********************** FONTS START ***********************/

      @font-face{
        font-family: Quicksand;
        src:url("/fonts/Quicksand-Regular.ttf");
      }

      @font-face{
        font-family: AlegreyaSans;
        src:url("/fonts/AlegreyaSans-Regular.ttf");
      }

      @font-face{
        font-family: Cardo;
        src:url("/fonts/Cardo-Regular.ttf");
      }

      @font-face{
        font-family: Cinzel;
        src:url("/fonts/Cinzel-Regular.ttf");
      }

      @font-face{
        font-family: Eczar;
        src:url("/fonts/Eczar-Regular.ttf");
      }

      @font-face{
        font-family: Gruppo;
        src:url("/fonts/Gruppo-Regular.ttf");
      }

      @font-face{
        font-family: JosefinSans;
        src:url("/fonts/JosefinSans-Regular.ttf");
      }

      @font-face{
        font-family: JosefinSlab;
        src:url("/fonts/JosefinSlab-Regular.ttf");
      }

      @font-face{
        font-family: Macondo;
        src:url("/fonts/Macondo-Regular.ttf");
      }

      @font-face{
        font-family: Philosopher;
        src:url("/fonts/Philosopher-Regular.ttf");
      }

      @font-face{
        font-family: Marcellus;
        src:url("/fonts/Marcellus-Regular.ttf");
      }

      @font-face{
        font-family: SpecialElite;
        src:url("/fonts/SpecialElite-Regular.ttf");
      }

      /*********************** FONTS END ***********************/
    `;

    return `
      ${CSS.rules.fonts}
    `;

  }

  static master(){
    CSS.rules.selectorsDefaults = `
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

    CSS.rules.scrollbar = `
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

    CSS.rules.root = `
      :root{
        font-size: 22px;

        color-scheme: ${CSS.values.color.scheme};
        accent-color: ${CSS.values.color.main};

        --document-Height: ${CSS.values.document.height};

        --z-minus: ${CSS.values.zIndex.minus};
        --z-body: ${CSS.values.zIndex.body};
        --z-footer: ${CSS.values.zIndex.footer};
        --z-main: ${CSS.values.zIndex.main};
        --z-boxes: ${CSS.values.zIndex.boxes};
        --z-header: ${CSS.values.zIndex.header};
        --z-cover: ${CSS.values.zIndex.cover};
        --z-modal: ${CSS.values.zIndex.modal};
        --z-menu: ${CSS.values.zIndex.menu};
        --z-tooltip: ${CSS.values.zIndex.tooltip};
        --z-toasts: ${CSS.values.zIndex.toasts};
        --z-loading: ${CSS.values.zIndex.loading};
        --z-urgent: ${CSS.values.zIndex.urgent};


        --header-height: ${CSS.values.header.height};
        --footer-height: ${CSS.values.footer.height};


        --padding: ${CSS.values.padding.default};
        --gap: ${CSS.values.gap.default};
        --radius: ${CSS.values.radius.default};
        --blur: ${CSS.values.blur.default};
        --transition-velocity: ${CSS.values.transition.velocity};
        --shadow-default: ${CSS.values.shadow.default};


        --color-main: ${CSS.values.color.main};
        --color-brand: var(--color-main);

        --color-success: ${CSS.values.color.success};
        --color-info: ${CSS.values.color.info};
        --color-warning: ${CSS.values.color.warning};
        --color-error: ${CSS.values.color.error};

        --color-surface-1: ${CSS.values.color.surface["1"]};
        --color-surface-2: ${CSS.values.color.surface["2"]};
        --color-surface-3: ${CSS.values.color.surface["3"]};
        --color-surface-4: ${CSS.values.color.surface["4"]};
        --color-surface-5: ${CSS.values.color.surface["5"]};
        --color-surface-6: ${CSS.values.color.surface["6"]};
        --color-surface-7: ${CSS.values.color.surface["7"]};
        --color-surface-8: ${CSS.values.color.surface["8"]};
        --color-surface-9: ${CSS.values.color.surface["9"]};
        --color-surface-10: ${CSS.values.color.surface["10"]};

        --color-text-primary: ${CSS.values.color.text.primary};
        --color-text-secondary: ${CSS.values.color.text.secondary};
        --color-text-accent: ${CSS.values.color.text.accent};

        --color-cover: ${CSS.values.color.cover};

      }
    `;

    CSS.rules.skeleton = `
      body{
        background-color: var(--color-surface-1);
        color: var(--color-text-primary);
        font-family: Quicksand;
        font-size: 1rem;
        height: 100vh;
        padding-top: var(--header-height);

      }

      body > loading{
        background-color: var(--color-surface-1);

        width: 100vw;
        height: 100vh;

        position: fixed;
        left: 0px;
        top: 0px;
        z-index: var(--z-loading);

        transition: var(--transition-velocity) opacity ease-in-out;

      }
      body > loading::after{
        content: '';
        background-color: transparent;
        height: 20vh;
        width: 20vh;
        border-radius: 100%;
        border: 0px solid transparent;
        border-right: 2px solid var(--color-text-primary);

        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transform-origin: center;

        animation: loading 1000ms infinite linear;

      }
      @keyframes loading{
        0%{transform: translate(-50%, -50%) rotate(0deg);}
        100%{transform: translate(-50%, -50%) rotate(720deg);}

      }

      body > toasts{
        height: auto;
        max-height: 100vh;
        width: 400px;
        padding: var(--padding);
        padding-bottom: calc(var(--padding) * 4);

        overflow-x: hidden;
        overflow-y: scroll;

        display: flex;
        flex-direction: column-reverse;
        gap: var(--gap);

        position: fixed;
        top: 0px;
        right: 0px;
        z-index: var(--z-toasts);

      }
      body > toasts:empty{
        padding: 0px;
      }

      body > menu{
        background-color: hsla(${CSS.values.color.brand.hue}, 10%, 25%, 0.1);
        backdrop-filter: blur(100px);
        height: 100vh;
        width: auto;

        overflow-y: scroll;

        display: grid;
        grid-template-rows: auto 2fr auto;
        justify-items: start;
        gap: var(--gap);

        position: fixed;
        z-index: var(--z-menu);
        top: 0;
        left: 0;
        transform: translate(-100%, 0);
        transition-duration: var(--transition-velocity);
        transition-timing-function: ease;
        transition-property: all;

      }

      body > menu > header{
        width: 100%;

        padding: calc(var(--padding) * 2);

        display: flex;
        flex-direction: row;
        justify-content: space-between;

      }
      body > menu > header > div{
        width: 30px;
        height: 30px;
      }
      body > menu > main{
        width: 100%;
        padding: calc(var(--padding) * 2);

        display: flex;
        flex-direction: column;
        gap: calc(var(--gap) / 2);

      }
      body > menu > main > section > section.parentMenu{
        display: grid;
        grid-template-columns: 2fr auto;
        place-items: center;

        border: 1px solid transparent;
        border-radius: var(--radius);
        padding: var(--padding) calc(var(--padding) * 2);

        transition: var(--transition-velocity) ease-in-out;
        transition-property: background-color, border;

      }
      body > menu > main > section > section.parentMenu > a{
        width: 100%;

        color: white;
        font-size: 1rem;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: var(--gap);

      }
      body > menu > main > section > section.parentMenu:where([active], :hover){
        background-color: hsla(${CSS.values.color.brand.hue}, 10%, 25%, 0.3);

      }
      body > menu > main > section > section.parentMenu:where([active]){
        border: 1px solid white;

      }
      body > menu > main > section > section.parentMenu > a > x-icon{
        height: 30px;
        width: 30px;

      }

      body > menu > main > section > section.parentMenu > x-icon[for=toggleSubMenu]{
        height: 30px;
        width: 30px;

        transition: var(--transition-velocity) ease-in-out transform;

      }
      body > menu > main > section > section.parentMenu > x-icon[for=toggleSubMenu].open{
        transform: scaleY(-1);
      }

      body > menu > main > section > section.subMenu{
        background-color: hsla(${CSS.values.color.brand.hue}, 10%, 25%, 0.3);

        margin-top: 5px;
        padding: calc(var(--padding) * 2);
        border-radius: var(--radius);

        display: none;
        flex-direction: column;
        gap: calc(var(--gap) / 2);

      }
      body > menu > main > section > section.subMenu.show{
        display: flex;
      }
      body > menu > main > section > section.subMenu:empty{
        display: none;
      }
      body > menu > main > section > section.subMenu > a{
        width: 100%;

        color: white;
        font-size: 0.8rem;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 7px;

        border: 1px solid transparent;
        border-radius: var(--radius);
        padding: var(--padding) calc(var(--padding) * 2);

        transition: var(--transition-velocity) ease-in-out;
        transition-property: background-color, border;

      }
      body > menu > main > section > section.subMenu > a:where([active], :hover){
        background-color: hsla(${CSS.values.color.brand.hue}, 10%, 25%, 0.3);

      }
      body > menu > main > section > section.subMenu > a:where([active]){
        border: 1px solid white;

      }

      body > menu > footer{}

      body > cover{
        pointer-events:auto;

        background: var(--color-cover);
        backdrop-filter: blur(var(--blur));
        opacity: 0;
        width: 100vw;
        height: 100vh;

        position: fixed;
        top: 0px;
        left: 0px;
        z-index: var(--z-minus);

        transition: var(--transition-velocity) opacity;

      }

      body > header{
        background-color: var(--color-main);
        color: white;

        width: 100%;
        height: var(--header-height);
        padding: var(--padding);

        position: fixed;
        top: 0px;
        left: 0px;
        z-index: var(--z-header);

        display: grid;
        grid-template-columns: auto 3fr;

        place-items: center;

      }
      body > header > x-icon[for=menu]{
        height: calc(var(--header-height) - var(--padding) * 2);
        width: calc(var(--header-height) - var(--padding) * 2);

      }


      body > main{
        width: 100vw;
        min-height: calc(100vh - var(--header-height));

      }

      body > footer{
        background-color: var(--color-surface-2);
        color: var(--color-text-primary);

        width: 100%;
        height: var(--footer-height);
        padding: var(--padding);

        display: grid;
        place-items: center;

      }
      body > footer.hide{
        display: none;
      }

      @media only screen and (max-width: ${CSS.values.screenSize.phone}) {
        :root{
          font-size: 16px;
        }

        html, body{
          height: 100vh;
          height: ${CSS.values.document.height};
          overflow: hidden;

        }

        body > toasts{
          width: 100vw;
          gap: 5px;
        }

        body > main {
          width: 100vw;
          height: calc(${CSS.values.document.height} - var(--header-height));
          overflow: hidden;
          overflow-y: scroll;

        }

        body > footer{
          display: none;
        }

      }

    `;

    CSS.rules.elementsDefaults = `
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

      /****************************** LI START ******************************/
      li{
        margin-left: 20px;
      }
      /****************************** LI END ******************************/

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
      ${CSS.rules.selectorsDefaults}
      ${CSS.rules.scrollbar}
      ${CSS.rules.root}
      ${CSS.rules.skeleton}
      ${CSS.rules.elementsDefaults}
    `;

  }

  static styles(){
    CSS.rules.form = `
      /************ Form Variables START ************/
      :root{
        --f-padding: 10px;
        --f-radius: 5px;
        --f-gap: 10px;
        --f-height: 40px;
        --f-width: 100%;
        --f-font-size: 20px;
        --f-border: 1px solid var(--color-text-secondary);
        --f-transition: var(--transition-velocity) ease-in-out;
        --f-transition-property: background-color, border;
      }
      /************ Form Variables END ************/

      /************ Form START ************/
      form{
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
        background-color: var(--color-text-primary);
        color: var(--color-text-accent);
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
        font-size: 0.8rem;
        min-height: 1rem;
        display: flex;
        flex-direction: row;
        padding: var(--padding);
      }
      /************ label > p START ************/

      /************ select, textarea, imput -> type = [text, password, eMail, number, color, file, date, tel] START ************/
      select,
      textarea,
      input:where([type=text], [type=eMail], [type=password], [type=number], [type=color], [type=file], [type=date], [type=tel]){
        background-color: var(--color-surface-3);
        width: var(--f-width);
        height: var(--f-height);
        font-size: var(--f-font-size);
        padding: 0 var(--f-padding);
        border-radius: var(--f-radius);
        border: var(--f-border);

        transition: var(--f-transition);
        transition-property: var(--f-transition-property);

      }
      /************ select, textarea, imput -> type = [text, password, eMail, number, color, file, date, tel] END ************/

      /************ :hover & :focus -> inputs & textarea & select START ************/
      select:not(:disabled):where(:hover, :focus),
      textarea:not(:disabled):where(:hover, :focus),
      input[type=number]:not(:disabled):where(:hover, :focus),
      input:not(:disabled):where(:hover, :focus){
        background-color: var(--color-surface-5);
        border: 1px solid var(--color-text-primary);

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
        padding: var(--padding);
        font-size: var(--f-font-size);

      }

      /* File Button */
      input[type=file]::file-selector-button{
        background-color: var(--color-main);
        color: white;
        font-size: var(--f-font-size);

        padding: 3px 10px;

        border: none;
        border-radius: var(--f-radius);

        cursor: pointer;

        filter: brightness(120%);
        transition: var(--transition-velocity) filter;

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
        cursor: pointer;
        user-select: none;

        background-color: var(--color-main);
        color: white;
        text-transform: uppercase;

        overflow: hidden;
        width: auto;
        height: var(--f-height);

        padding: 0px var(--f-padding);
        border-radius: var(--f-radius);
        border: none;
        box-shadow: 0px 5px 10px 0px rgba(0 0 0 / 0.3);

        filter: brightness(120%);
        transition: var(--transition-velocity) ease-in-out;
        transition-property: filter transform box-shadow;

      }

      /* On Hover */
      button:not(:disabled):where(:hover),
      input[type=submit]:not(:disabled):where(:hover){
        filter: brightness(80%);
      }

      /* On Active */
      button:not(:disabled):where(:active),
      input[type=submit]:not(:disabled):where(:active){
        transform: translateY(5px);
        box-shadow: 0px 5px 10px -5px rgba(0 0 0 / 0.3);
      }

      /* On Focus */
      button:not(:disabled):where(:focus),
      input[type=submit]:not(:disabled):where(:focus){
      }

      /************ input[type=submit] & button END ************/
    `;

    CSS.rules.table = `
      /************ Table START ************/
      table{
        --table-radius: 3px;

        /* make table cells with same */
        table-layout: auto;

        width: 100%;
        border: 1px solid var(--color-main);
        border-radius: var(--radius);
        padding: var(--padding);

      }
      /************ Table END ************/

      /************ thead START ************/
      table > thead{
        background-color: var(--color-surface-10);
      }

      table > thead > tr > th{
        color: var(--color-text-accent);
        font-weight: bold;

        border-radius: var(--table-radius);
        padding: var(--padding);

      }
      /************ thead END ************/

      /************ tbody START ************/
      table > tbody > tr:nth-child(odd){
        background-color: var(--color-surface-4);

      }
      table > tbody > tr:nth-child(even){
        background-color: var(--color-surface-5);

      }

      table > tbody > tr > td{
        border-radius: var(--table-radius);
        padding: var(--padding);

      }

      /* tr:hover START */
      table > tbody > tr{
        transition: var(--transition-velocity) ease-in-out background-color;
      }

      table > tbody > tr:hover{
        background-color: var(--color-surface-7);
      }
      /* tr:hover END */

      /************ tbody END ************/

      /************ tfead START ************/
      table > tfoot{
        background-color: var(--color-surface-9);
      }

      table > tfoot > tr > td{
        color: var(--color-text-accent);

        border-radius: var(--table-radius);
        padding: var(--padding);

      }
      /************ tfoot END ************/
    `;

    return `
      ${CSS.rules.form}
      ${CSS.rules.table}
    `;

  }

  static layouts(){
    CSS.rules.boxes = `
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

    CSS.rules.layoutSystem = `
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

      @media only screen and (max-width: ${CSS.values.screenSize.phone}) {
        row{
          flex-direction: column;
          width: 100% !important;
        }
        column{
          width: 100% !important;
        }

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
      ${CSS.rules.boxes}
      ${CSS.rules.layoutSystem}
    `;

  }

}

// Make CSS Usable W/O Importing It
window.CSS = CSS;
