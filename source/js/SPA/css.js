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
    CSS.light();
    CSS.doMath();

  }

  static doMath(){
    // Not Sure If We Ever Used This
    CSS.val.color.accent = CSS.val.color.main;

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

}

// Make CSS Usable W/O Importing It
window.CSS = CSS;
