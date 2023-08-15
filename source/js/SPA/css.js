// // Get the :root styles
// const rootStyles = document.querySelector(':root');
// // Set/Update new values
// rootStyles.style.setProperty("--color-success", "hsla(211.059, 100%, 50%, 1)");

// // Compute the :root styles
// const computedRootStyles = getComputedStyle(rootStyles);
// // Get computed value
// console.log(computedRootStyles.getPropertyValue("--color-success"));

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

"use strict";

export default class CSS{
  // Color Modes
  static colorModes = Object.freeze({
    DARK: 1,
    LIGHT: 2
  });

  // Color Mode Default: Dark Mode
  static currentColorMode = CSS.colorModes.DARK;

  //////////// APIs
  ///// Init
  static init(){
    CSS.#loadColorBrand();
    CSS.detectColorMode();
    CSS.#onColorModeChange();
  }

  // Get CSS value
  static getValue(variable){
    return getComputedStyle(document.querySelector(':root')).getPropertyValue(variable);
  }

  ///// Load Brand Color From Configurations File
  static #loadColorBrand(){
    // Update CSS color main
    const rootStyles = document.querySelector(':root');

    rootStyles.style.setProperty("--color-main-hue", `${window.CONF.default.color.brand.hue || 230}deg`);
    rootStyles.style.setProperty("--color-main-saturation", `${window.CONF.default.color.brand.saturation || 13}%`);
    rootStyles.style.setProperty("--color-main-lightness", `${window.CONF.default.color.brand.lightness || 9}%`);
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

  // On System Color Mode Changes - Listen To Color Mode Changes
  static #onColorModeChange(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", CSS.detectColorMode);}

  // Color Mode Switcher
  static colorModeSwitcher(){
    switch(CSS.currentColorMode){
      case CSS.colorModes.DARK:
        Log.info("CSS.colorModeSwitcher: DARK");
        CSS.#dark();
        CSS.currentColorMode = CSS.colorModes.DARK;
        break;

      case CSS.colorModes.LIGHT:
        Log.info("CSS.colorModeSwitcher: LIGHT");
        CSS.#light();
        CSS.currentColorMode = CSS.colorModes.LIGHT;
        break;

      default:
        Log.info("CSS.colorModeSwitcher: DARK (Default)");
        CSS.#dark();
        CSS.currentColorMode = CSS.colorModes.DARK;
    }
  }

  //////////// Modes
  static #dark(){
    const rootStyles = document.querySelector(':root');
    const hue = getComputedStyle(rootStyles).getPropertyValue("--color-main-hue");

    rootStyles.style.setProperty("--color-surface-1", `hsla(${hue}, 10%, 10%, 1)`);
    rootStyles.style.setProperty("--color-surface-2", `hsla(${hue}, 10%, 15%, 1)`);
    rootStyles.style.setProperty("--color-surface-3", `hsla(${hue}, 10%, 20%, 1)`);
    rootStyles.style.setProperty("--color-surface-4", `hsla(${hue}, 10%, 25%, 1)`);
    rootStyles.style.setProperty("--color-surface-5", `hsla(${hue}, 10%, 30%, 1)`);
    rootStyles.style.setProperty("--color-surface-6", `hsla(${hue}, 10%, 35%, 1)`);
    rootStyles.style.setProperty("--color-surface-7", `hsla(${hue}, 10%, 50%, 1)`);
    rootStyles.style.setProperty("--color-surface-8", `hsla(${hue}, 10%, 65%, 1)`);
    rootStyles.style.setProperty("--color-surface-9", `hsla(${hue}, 10%, 80%, 1)`);
    rootStyles.style.setProperty("--color-surface-10", `hsla(${hue}, 10%, 95%, 1)`);

    rootStyles.style.setProperty("--color-text-primary", `hsla(${hue}, 15%, 95%, 1)`);
    rootStyles.style.setProperty("--color-text-secondary", `hsla(${hue}, 5%, 75%, 1)`);
    rootStyles.style.setProperty("--color-text-accent", `hsla(${hue}, ${CSS.getValue("--color-main-saturation")}, 5%, 1)`);

    rootStyles.style.setProperty("color-scheme", "dark");

    rootStyles.style.setProperty("--shadow", `0px 10px 10px -5px hsla(${hue} 50% 3% / 0.3)`);
  }

  static #light(){
    const rootStyles = document.querySelector(':root');
    const hue = getComputedStyle(rootStyles).getPropertyValue("--color-main-hue");

    rootStyles.style.setProperty("--color-surface-1", `hsla(${hue}, 20%, 100%, 1)`);
    rootStyles.style.setProperty("--color-surface-2", `hsla(${hue}, 20%, 95%, 1)`);
    rootStyles.style.setProperty("--color-surface-3", `hsla(${hue}, 20%, 90%, 1)`);
    rootStyles.style.setProperty("--color-surface-4", `hsla(${hue}, 20%, 85%, 1)`);
    rootStyles.style.setProperty("--color-surface-5", `hsla(${hue}, 20%, 80%, 1)`);
    rootStyles.style.setProperty("--color-surface-6", `hsla(${hue}, 20%, 75%, 1)`);
    rootStyles.style.setProperty("--color-surface-7", `hsla(${hue}, 20%, 60%, 1)`);
    rootStyles.style.setProperty("--color-surface-8", `hsla(${hue}, 20%, 45%, 1)`);
    rootStyles.style.setProperty("--color-surface-9", `hsla(${hue}, 20%, 30%, 1)`);
    rootStyles.style.setProperty("--color-surface-10", `hsla(${hue}, 20%, 15%, 1)`);

    rootStyles.style.setProperty("--color-text-primary", `hsla(${hue}deg, ${CSS.getValue("--color-main-saturation")}%, 10%, 1)`);
    rootStyles.style.setProperty("--color-text-secondary", `hsla(${hue}deg, 30%, 30%, 1)`);
    rootStyles.style.setProperty("--color-text-accent", `hsla(${hue}deg, 15%, 95%, 1)`);

    rootStyles.style.setProperty("color-scheme", "light");

    rootStyles.style.setProperty("--shadow", `0px 10px 10px -5px hsla(${hue}deg 10% 2% / 0.2)`);
  }
}

// Make CSS Usable W/O Importing It
window.CSS = CSS;
