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
    
    margin: {
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

    CSS.#onColorModeChange();

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
      // System Default: Light
      if(window.matchMedia('(prefers-color-scheme: light)').matches) CSS.currentColorMode = CSS.colorModes.LIGHT;

      // System Default: Dark
      else CSS.currentColorMode = CSS.colorModes.DARK;

    }

    // Update The Colors According To Color Mode
    CSS.colorModeSwitcher();

  }

  // On System Color Mode Changes
  static #onColorModeChange(){
    // Listen To Color Mode Changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", CSS.detectColorMode);
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
      ${CSS.XUI()}
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

    CSS.rules.defaultScrollbar = `
      /* Removing Default Scroll Bar START */
      *{
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }

      /* Chrome, Safari, Opera */
      *::-webkit-scrollbar{
        display: none;
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
        --padding: ${CSS.values.margin.default};
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
      ${CSS.rules.defaultScrollbar}
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
        width: 100%;
      }
      /************ label START ************/

      /************ label > p START ************/
      form label > p{
        font-size: 0.8rem;
        min-height: 1rem;
        display: inline-block;
        padding: var(--padding);
      }
      /************ label > p START ************/

      /************ select, textarea, imput -> type = [text, password, eMail, number, color, file, date, tel, range] START ************/
      select,
      textarea,
      input:where([type=text], [type=eMail], [type=password], [type=number], [type=color], [type=file], [type=date], [type=tel], [type=range]){
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
      /************ select, textarea, imput -> type = [text, password, eMail, number, color, file, date, tel, range] END ************/

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

        display: block;
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

    CSS.rules.customScrollbar = `
      /************ Common START ************/
      .scrollbar-x,
      .scrollbar-y{
        overflow: hidden;      
      }
      .scrollbar-x{
        overflow-x: scroll;
        
      }
      .scrollbar-y{
        overflow-y: scroll;
      }      
      /************ Common END ************/


      /************ Firefox START ************/
      :where(.scrollbar-x, .scrollbar-y){
        scrollbar-width: auto;
        scrollbar-color: var(--color-brand) transparent;    
      }
      /************ Firefox END ************/

      /************ All Other Browsers START ************/
      :where(.scrollbar-x, .scrollbar-y)::-webkit-scrollbar{   
        display: unset;     
        width: 5px;
        height: 5px;
      }
      :where(.scrollbar-x, .scrollbar-y)::-webkit-scrollbar-track{        
        background-color: transparent;
      }
      :where(.scrollbar-x, .scrollbar-y)::-webkit-scrollbar-thumb{        
        background-color: hsla(${CSS.values.color.brand.hue}deg, ${CSS.values.color.brand.saturation}%, ${CSS.values.color.brand.lightness}%, 0.5);
        border-radius: 5px;
      }
      :where(.scrollbar-x, .scrollbar-y)::-webkit-scrollbar-thumb:hover{        
        background-color: hsla(${CSS.values.color.brand.hue}deg, ${CSS.values.color.brand.saturation}%, ${CSS.values.color.brand.lightness}%, 1);
      }
      /************ All Other Browsers END ************/
    `;

    return `
      ${CSS.rules.form}
      ${CSS.rules.table}
      ${CSS.rules.customScrollbar}
    `;

  }

  static XUI(){
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
        max-width: 100vw;

      }

      row{
        width: 100%;
        flex-direction: row;
        justify-content: center;

      }

      column{
        width: auto;

        flex-direction: column;
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
      /*********************** Layout System END ***********************/    
    `;

    CSS.rules.display = `
      .d-block{display: block;}
      .d-inline-block{display: inline-block;}



      .d-flex{display: flex;}
      .flex-row{flex-direction: row;}
      .flex-column{flex-direction: column;}

      /* X */
      .justify-content-start{justify-content: flex-start;}
      .justify-content-end{justify-content: flex-end;}
      .justify-content-center{justify-content: center;}
      .justify-content-between{justify-content: space-between;}
      .justify-content-around{justify-content: space-around;}

      /* Y */
      .align-items-start{align-items: flex-start;}
      .align-items-end{align-items: flex-end;}
      .align-items-center{align-items: center;}
      .align-items-baseline{align-items: baseline;}
      .align-items-stretch{align-items: stretch;}

      .align-self-start{align-self: flex-start;}
      .align-self-end{align-self: flex-end;}
      .align-self-center{align-self: center;}
      .align-self-baseline{align-self: baseline;}
      .align-self-stretch{align-self: stretch;}

      .flex-nowrap{flex-wrap: nowrap;}
      .flex-wrap{flex-wrap: wrap;}
      .flex-wrap-reverse{flex-wrap: wrap-reverse;}


      /***** Gap START *****/

      .gap-1{gap: var(--gap);}
      .gap-2{gap: calc(var(--gap) * 2);}
      .gap-3{gap: calc(var(--gap) * 3);}
      .gap-4{gap: calc(var(--gap) * 4);}
      .gap-5{gap: calc(var(--gap) * 5);}
  
      /***** Gap END *****/

    `;

    CSS.rules.backgroundColor = `
      .color-surface-brand{background-color: var(--color-brand);}
      
      .color-surface-1{background-color: var(--color-surface-1);}
      .color-surface-2{background-color: var(--color-surface-2);}
      .color-surface-3{background-color: var(--color-surface-3);}
      .color-surface-4{background-color: var(--color-surface-4);}
      .color-surface-5{background-color: var(--color-surface-5);}
      .color-surface-6{background-color: var(--color-surface-6);}
      .color-surface-7{background-color: var(--color-surface-7);}
      .color-surface-8{background-color: var(--color-surface-8);}
      .color-surface-9{background-color: var(--color-surface-9);}
      .color-surface-10{background-color: var(--color-surface-10);}

      .color-surface-success  {background-color: var(--color-success);}
      .color-surface-info     {background-color: var(--color-info);}
      .color-surface-warning  {background-color: var(--color-warning);}
      .color-surface-error    {background-color: var(--color-error);}

      .color-surface-gradient-left  {background-image: linear-gradient(to left, var(--color-surface-2), var(--color-surface-6));}
      .color-surface-gradient-right {background-image: linear-gradient(to right, var(--color-surface-2), var(--color-surface-6));}
      .color-surface-gradient-45    {background-image: linear-gradient(45deg, var(--color-surface-2), var(--color-surface-6) 80%);}
    `;

    CSS.rules.text = `
      .color-text-brand{color: var(--color-brand);}

      .color-text-primary{color: var(--color-text-primary);}
      .color-text-secondary{color: var(--color-text-secondary);}
      .color-text-accent{color: var(--color-text-accent);}
      
      .color-text-success{color: var(--color-success);}
      .color-text-info{color: var(--color-info);}
      .color-text-warning{color: var(--color-warning);}
      .color-text-error{color: var(--color-error);}

      .text-left{text-align: left;}
      .text-center{text-align: center;}
      .text-right{text-align: right;}

      .text-bold{font-weight: bold;}
      .text-italic{font-style: italic;}

    `;

    CSS.rules.width = `
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
      
      .w-auto{width: auto;}

      /* Widths END */    
    `;

    CSS.rules.padding = `
      /***** Paddings START *****/

      .p-1{padding: var(--padding);}
      .p-2{padding: calc(var(--padding) * 2);}
      .p-3{padding: calc(var(--padding) * 3);}
      .p-4{padding: calc(var(--padding) * 4);}
      .p-5{padding: calc(var(--padding) * 5);}

      /* Top */
      .pt-1{padding-top: var(--padding);}
      .pt-2{padding-top: calc(var(--padding) * 2);}
      .pt-3{padding-top: calc(var(--padding) * 3);}
      .pt-4{padding-top: calc(var(--padding) * 4);}
      .pt-5{padding-top: calc(var(--padding) * 5);}

      /* Right */
      .pr-1{padding-right: var(--padding);}
      .pr-2{padding-right: calc(var(--padding) * 2);}
      .pr-3{padding-right: calc(var(--padding) * 3);}
      .pr-4{padding-right: calc(var(--padding) * 4);}
      .pr-5{padding-right: calc(var(--padding) * 5);}

      /* Bottom */
      .pb-1{padding-bottom: var(--padding);}
      .pb-2{padding-bottom: calc(var(--padding) * 2);}
      .pb-3{padding-bottom: calc(var(--padding) * 3);}
      .pb-4{padding-bottom: calc(var(--padding) * 4);}
      .pb-5{padding-bottom: calc(var(--padding) * 5);}

      /* Left */
      .pl-1{padding-left: var(--padding);}
      .pl-2{padding-left: calc(var(--padding) * 2);}
      .pl-3{padding-left: calc(var(--padding) * 3);}
      .pl-4{padding-left: calc(var(--padding) * 4);}
      .pl-5{padding-left: calc(var(--padding) * 5);}

      /* X, Left To Right */
      .px-1{
        padding-left: var(--padding);
        padding-right: var(--padding);
      }
      .px-2{
        padding-left: calc(var(--padding) * 2);
        padding-right: calc(var(--padding) * 2);
      }
      .px-3{
        padding-left: calc(var(--padding) * 3);
        padding-right: calc(var(--padding) * 3);
      }
      .px-4{
        padding-left: calc(var(--padding) * 4);
        padding-right: calc(var(--padding) * 4);
      }
      .px-5{
        padding-left: calc(var(--padding) * 5);
        padding-right: calc(var(--padding) * 5);
      }

      /* Y, Top To Bottom */
      .py-1{
        padding-top: var(--padding);
        padding-bottom: var(--padding);
      }
      .py-2{
        padding-top: calc(var(--padding) * 2);
        padding-bottom: calc(var(--padding) * 2);
      }
      .py-3{
        padding-top: calc(var(--padding) * 3);
        padding-bottom: calc(var(--padding) * 3);
      }
      .py-4{
        padding-top: calc(var(--padding) * 4);
        padding-bottom: calc(var(--padding) * 4);
      }
      .py-5{
        padding-top: calc(var(--padding) * 5);
        padding-bottom: calc(var(--padding) * 5);
      }

      /***** Paddings END *****/    
    `;

    CSS.rules.margin = `
      /***** Margings START *****/

      .m-1{margin: var(--margin);}
      .m-2{margin: calc(var(--margin) * 2);}
      .m-3{margin: calc(var(--margin) * 3);}
      .m-4{margin: calc(var(--margin) * 4);}
      .m-5{margin: calc(var(--margin) * 5);}

      /* Top */
      .mt-1{margin-top: var(--margin);}
      .mt-2{margin-top: calc(var(--margin) * 2);}
      .mt-3{margin-top: calc(var(--margin) * 3);}
      .mt-4{margin-top: calc(var(--margin) * 4);}
      .mt-5{margin-top: calc(var(--margin) * 5);}

      /* Right */
      .mr-1{margin-right: var(--margin);}
      .mr-2{margin-right: calc(var(--margin) * 2);}
      .mr-3{margin-right: calc(var(--margin) * 3);}
      .mr-4{margin-right: calc(var(--margin) * 4);}
      .mr-5{margin-right: calc(var(--margin) * 5);}

      /* Bottom */
      .mb-1{margin-bottom: var(--margin);}
      .mb-2{margin-bottom: calc(var(--margin) * 2);}
      .mb-3{margin-bottom: calc(var(--margin) * 3);}
      .mb-4{margin-bottom: calc(var(--margin) * 4);}
      .mb-5{margin-bottom: calc(var(--margin) * 5);}

      /* Left */
      .ml-1{margin-left: var(--margin);}
      .ml-2{margin-left: calc(var(--margin) * 2);}
      .ml-3{margin-left: calc(var(--margin) * 3);}
      .ml-4{margin-left: calc(var(--margin) * 4);}
      .ml-5{margin-left: calc(var(--margin) * 5);}

      /* X, Left To Right */
      .mx-1{
        margin-left: var(--margin);
        margin-right: var(--margin);
      }
      .mx-2{
        margin-left: calc(var(--margin) * 2);
        margin-right: calc(var(--margin) * 2);
      }
      .mx-3{
        margin-left: calc(var(--margin) * 3);
        margin-right: calc(var(--margin) * 3);
      }
      .mx-4{
        margin-left: calc(var(--margin) * 4);
        margin-right: calc(var(--margin) * 4);
      }
      .mx-5{
        margin-left: calc(var(--margin) * 5);
        margin-right: calc(var(--margin) * 5);
      }

      /* Y, Top To Bottom */
      .my-1{
        margin-top: var(--margin);
        margin-bottom: var(--margin);
      }
      .my-2{
        margin-top: calc(var(--margin) * 2);
        margin-bottom: calc(var(--margin) * 2);
      }
      .my-3{
        margin-top: calc(var(--margin) * 3);
        margin-bottom: calc(var(--margin) * 3);
      }
      .my-4{
        margin-top: calc(var(--margin) * 4);
        margin-bottom: calc(var(--margin) * 4);
      }
      .my-5{
        margin-top: calc(var(--margin) * 5);
        margin-bottom: calc(var(--margin) * 5);
      }

      /***** Margings END *****/        
    `;

    CSS.rules.radius = `
      /* Radiuses START */
      .radius{border-radius: var(--radius);}
      .radius-circle{border-radius: 50%;}
      /* Radiuses END */
    `;

    CSS.rules.shadow = `
      /* Background Shadow START */
      .bs{box-shadow: var(--shadow-default);}
      /* Background Shadow END */
    `;

    return `
      ${CSS.rules.boxes}
      ${CSS.rules.layoutSystem}
      ${CSS.rules.display}
      ${CSS.rules.backgroundColor}
      ${CSS.rules.text}
      ${CSS.rules.width}
      ${CSS.rules.padding}
      ${CSS.rules.margin}
      ${CSS.rules.radius}
      ${CSS.rules.shadow}
    `;

  }

}

// Make CSS Usable W/O Importing It
window.CSS = CSS;
