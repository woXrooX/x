"use strict";

import Hyperlink from "./hyperlink.js";
import Toast from "./elements/toast.js";

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

        let response = await window.bridge(`${form.getAttribute("for")}`, data);
        if("field" in response) Form.#response(response["field"], response["type"], response["message"]);
      };
    });
  }

  static #onSubmit(form){
    form.onsubmit = async ()=>{
      event.preventDefault();

      // PLZW8
      Form.#response("info", "plzW8", form.getAttribute("for"));

      // FormData / Data
      let formData = new FormData(event.target);
      let data = {
        for: form.getAttribute("for"),
        field: "all",
        fields: {}
      }
      for(let entry of formData.entries()){data["fields"][entry[0]] = entry[1];}

      let response = await window.bridge(form.getAttribute("for"), data);
      console.log(response);

      // Above Input Field
      if("field" in response) Form.#response(response["type"], null, response["field"], true);

      // Above Submit Field
      Form.#response(response["type"], response["message"], form.getAttribute("for"));

      ////////// Check If Response Includes Actions
      if("actions" in response === false) return;

      // Update window.conf
      if("updateConf" in response["actions"]) window.conf = response["actions"]["updateConf"];

      // Set window.session["user"]
      if("setSessionUser" in response["actions"]) window.session["user"] = response["actions"]["setSessionUser"];

      // Delete window.session["user"]
      if("deleteSessionUser" in response["actions"]) delete window.session["user"];

      // Toast
      if("toast" in response["actions"]) Toast.new(response["actions"]["toast"]["type"], response["actions"]["toast"]["content"]);

      // Dom Update
      if("domChange" in response["actions"]) window.dispatchEvent(new CustomEvent("domChange", {detail: response["actions"]["domChange"]["section"]}));

      // Redirect
      if("redirect" in response["actions"]) Hyperlink.locate(response["actions"]["redirect"]["url"]);

      // Reload
      if("reload" in response["actions"]) window.location.reload();

    };
  }

  static #response(type, message, field, flash = false, toast = false){
    const elementP = document.querySelector(`p[for=${field}]`);

    // Check If Element <p> Exists
    if(!!elementP === false) return;

    // Above Submit Button
    if(!!message != false) elementP.innerHTML = `<${type}>${langDict[message][langCode]}</${type}>`;

    // Focus & Flash The Border Color
    const elementInput = document.querySelector(`input[name=${field}]`);
    if(!!elementInput && elementInput.getAttribute("type") != "submit"){
      // Focus
      elementInput.focus();

      // Flash Border Color
      if(flash === true) Form.#flash(type, field);

    }

    // Enable Toast
    if(toast === true) Toast.new(type, message);

  }

  static #flash(type, field){
    const element = document.querySelector(`input[name=${field}]`);

    // Check If Element Exists
    if(!!element === false) return;

    // Activate Border Color
    element.style.borderColor = getComputedStyle(document.body).getPropertyValue(`--color-${type}`);

    // Flash Border Color
    setTimeout(()=>{element.removeAttribute("style");}, 2000);

  }

}
