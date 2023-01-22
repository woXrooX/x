"use strict";

///////////////////////////// SPA / Core
import Core from "./SPA/core.js";


///////////////////////////// Tools
// import Form from "./modules/tools.js";


///////////////////////////// Brideg / Fetch
// import bridge from "./modules/bridge.js";

///////////////////////////// GLOBAL DATA
// conf, session, langCode, langDict, languages, currencies
// GlobalData: {
//   let response = await bridge("bridge", {for:"globalData"});
//   window.conf = response["conf"];
//   window.session = response["session"];
//   window.langCode = response["langCode"];
//   window.langDict = response["langDict"];
//   window.languages = response["languages"];
//   window.currencies = response["currencies"];
// }

// prefers-color-scheme TMP
// console.log(window.matchMedia("(prefers-color-scheme: dark)"));
// console.log(window.matchMedia("(prefers-color-scheme: dark)").matches);
// const mq = window.matchMedia("(prefers-color-scheme: dark)");
// mq.addEventListener('change', ({matches: isDark})=>{
//   console.log(matches);
//   console.log("Changed");
// });
// mq.dispatchEvent(new Event('change'));


///////////////////////////// CSS
// import styles from '../css/styles.css' assert {type: 'css'};
// console.log(styles.rules);
// styles.rules[0].style.color = "blue";
// console.log(styles.rules[0].style.color);


///////////////////////////// PWA serviceWorker
// if(document.readyState === "complete"){
//   if('serviceWorker' in navigator){
//     navigator.serviceWorker.register('../PWA/sw.js', {scope: '../PWA/'})
//     .then(reg => {console.log('Registration succeeded. Scope is ' + reg.scope);}) // registration succeeded
//     .catch(err => {console.error('Registration failed with ' + err);}); // registration failed
//   }
// }


// const stripe = Stripe('pk_test_51Kr4zpAh3t85mIMGcpGTyCesktRL3wdpQZATQp0q8dTJXBjdOggQADHZaEgM2D2XcbKbFCTELj9wjtEuW5nEwPHe00lh4kxZbP');
//
// const button = document.querySelector('#btn');
// button.addEventListener('click', event => {
//     stripe.redirectToCheckout({
//         // Make the id field from the Checkout Session creation API response
//         // available to this file, so you can provide it as parameter here
//         // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
//         sessionId: 'cs_test_a1CStvjaARtxlAiZWZlenyuNCIN4wErKFw1EFQjtPi3TaA6QjOwxqNEpMm'
//     }).then(function (result) {
//         // If `redirectToCheckout` fails due to a browser or network
//         // error, display the localized error message to your customer
//         // using `result.error.message`.
//     });
// })
