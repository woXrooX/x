"use strict";

export default class Form{
  static #flashDuration = 2000;

  static collect(element = null){
    if(!!element === false) element = document;

    // Returns Live Collection
    // const forms = element.getElementsByTagName("form");

    // Since We Are Manuallay Collecting Inside Modal We Want To Isolate Collecting "x-modal form" Here
    const forms = element.querySelectorAll(':not(x-modal) > form');

    for(const form of forms){
      if(Form.#formGuard(form) === false) continue;

      Form.register(form);

    }

  }

  static register(form){
    // Enable Events Listeners
    Form.#onInput(form);
    Form.#onSubmit(form);

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
    form.onsubmit = async (event)=>{
      event.preventDefault();

      // The Submitter
      const submitter = event.submitter;

      // Disable Submitter Button
      submitter.disabled = true;

      // PLZW8
      Form.#response("info", "plzW8", form.getAttribute("for"));

      // Get FormData
      let formData = new FormData(event.target);

      // Append for To FormData
      formData.append("for", form.getAttribute("for"));

      // Send The Request
      let response = await window.bridge(form.action, formData, form.enctype);

      // Data From Back-End
      console.log(response);

      // Above Input Field
      if("field" in response) Form.#response(response["type"], null, response["field"], true);

      // Above Submit Field
      Form.#response(response["type"], response["message"], form.getAttribute("for"));

      // Enable Submitter Button
      submitter.disabled = false;

      ////////// Check If Response Includes Actions
      if("actions" in response === false) return;

      // Update window.conf
      if("updateConf" in response["actions"]) window.conf = response["actions"]["updateConf"];

      // Set window.session["user"]
      if("setSessionUser" in response["actions"]) window.session["user"] = response["actions"]["setSessionUser"];

      // Delete window.session["user"]
      if("deleteSessionUser" in response["actions"]) delete window.session["user"];

      // Toast
      if("toast" in response["actions"]) window.Toast.new(response["actions"]["toast"]["type"], response["actions"]["toast"]["content"]);

      // Dom Update
      if("domChange" in response["actions"]) window.dispatchEvent(new CustomEvent("domChange", {detail: response["actions"]["domChange"]}));

      // Redirect
      if("redirect" in response["actions"]) window.Hyperlink.locate(response["actions"]["redirect"]);

      // Reload
      if("reload" in response["actions"]) window.location.reload();

      // Execute Function On Form Got Response
      if("onFormGotResponse" in response["actions"]) window.DOM.executeOnFormGotResponse(response);

    };
  }

  static #response(type, message, field, flash = false, toast = false){
    const elementP = document.querySelector(`p[for=${field}]`);

    // Above Submit Button
    if(!!message != false && !!elementP === true) elementP.innerHTML = `<${type}>${window.Lang.use(message)}</${type}>`;

    // Focus & Flash The Border Color
    const element = document.querySelector(`[name=${field}]`);
    if(!!element === true && element.getAttribute("type") != "submit"){
      // Focus
      element.focus();

      // Flash Border Color
      if(flash === true) Form.#flash(type, element);

    }

    // If Toast Is Enabled
    if(toast === true) window.Toast.new(type, message);

  }

  static #flash(type, element){
    // Activate Border Color
    element.style.borderColor = getComputedStyle(document.body).getPropertyValue(`--color-${type}`);

    // Flash Border Color
    setTimeout(()=>{element.removeAttribute("style");}, Form.#flashDuration);

  }

  static #formGuard(form){
    // form Value Is Falsy
    if(!!form === false) return false;

    // Check If "form" has "action" Attribute
    if(form.hasAttribute("action") === false) return false;

    // Check If "form" Attribute "action" has Falsy Value
    if(!!form.action === false) return false;

    // Check If "form" has "for" Attribute
    if(form.hasAttribute("for") === false) return false;

    // Check If "form" Attribute "for" has Falsy Value
    if(!!form.getAttribute("for") === false) return false;

    return true;

  }

}

// Make Form Usable W/O Importing It
window.Form = Form;
