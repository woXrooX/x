"use strict";
///////////////////////////// SPA / Core
import Core from "./SPA/core.js";

///////////////////////////// PWA serviceWorker
// if(document.readyState === "complete"){
//   if('serviceWorker' in navigator){
//     navigator.serviceWorker.register('../PWA/sw.js', {scope: '../PWA/'})
//     .then(reg => {console.log('Registration succeeded. Scope is ' + reg.scope);}) // registration succeeded
//     .catch(err => {console.error('Registration failed with ' + err);}); // registration failed
//   }
// }
