"use strict";

import bridge from "../modules/bridge.js"

import Hyperlink from "./hyperlink.js";
// import Toast from "./elements/toast.js";

export default class Form{

  static collect(){
    const forms = document.getElementsByTagName("form");

    for(const form of forms){
      if(form.hasAttribute("for") && form.getAttribute("for") != ""){
        Form.#onInput(form);
        Form.#onSubmit(form);

      }
    }

  }

  static #onInput(form){
    // check if onInput mode is enabled
    if(!form.hasAttribute("oninputcheck")) return;

    form.querySelectorAll("label > input").forEach((input) => {
      input.oninput = async ()=>{
        let data = {
          for: form.getAttribute("for"),
          field: event.target.name,
          fields: {}
        }
        data["fields"][event.target.name] = event.target.value;

        let response = await bridge(`${form.getAttribute("for")}`, data);
        if("field" in response) Form.#response(response["field"], response["response"], response["title"]);
      };
    });
  }

  static #onSubmit(form){
    form.onsubmit = async ()=>{
      event.preventDefault();

      // PLZW8
      Form.#response(form.getAttribute("for"), "info", "plzW8");

      // FormData / Data
      let formData = new FormData(event.target);
      let data = {
        for: form.getAttribute("for"),
        field: "all",
        fields: {}
      }
      for(let entry of formData.entries()){data["fields"][entry[0]] = entry[1];}

      let response = await bridge(form.getAttribute("for"), data);
      console.log(response);

      // Above Input Field
      if("field" in response) Form.#response(response["field"], response["response"], null, true);

      // Above Submit Field
      Form.#response(form.getAttribute("for"), response["response"], response["title"], false, true);

      // Check If Response Includes Action
      if("action" in response === false){
        // console.log("No Action Specified");
        return;
      }

      // // Update body > main
      // if(response["action"] == "updateMain"){
      //   Html.updateMain(path);
      // }

      // Redirect
      if(response["action"] == "redirect") Hyperlink.locate(response["redirectUrl"]);

      // Reload
      if(response["action"] == "reload") window.location.reload();

    };
  }

  static #response(field, type, message = null, flash = false, toast = false){
    // Above Submit Button
    if(!!document.querySelector(`p[for=${field}]`) && message != null)
      document.querySelector(`p[for=${field}]`).innerHTML = `<${type}>${langDict[message][langCode]}</${type}>`;

    // Activate | Flash Border Color
    if(!!document.querySelector(`input[name=${field}]`) && document.querySelector(`input[name=${field}]`).getAttribute("type") != "submit"){
      // Breaking Border Animation On Focus
      // document.querySelector(`input[name=${field}]`).focus();

      // Activate Border Color
      document.querySelector(`input[name=${field}]`).style.borderColor = getComputedStyle(document.body).getPropertyValue(`--color-${type}`);

      // Flash Border Color
      if(flash === true){
        setTimeout(()=>{
          document.querySelector(`input[name=${field}]`).removeAttribute("style");
        }, 1500);
      }
    }

    // Enable Toast
    // if(toast === true) Toast.new(type, message);
  }
}
