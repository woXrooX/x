// import Dom from "./dom.js";
//
// const form = {
//   "form":{
//     "attributes":[{"method":"POST"},{"class":"myForm"}],
//     "childNodes": [
//       {"input":{"attributes":[{"type":"text"},{"name":"username"},{"placeholder":"Username"}]}},
//       {"br":{}},
//       {"input":{"attributes":[{"type":"password"},{"name":"password"},{"placeholder":"Password"}]}},
//       {"br":{}},
//       {"input":{"attributes":[{"type":"submit"},{"name":"logIn"},{"value":"Log In"}]}}
//     ]
//   }
// };
//
// const done = Dom.jsonToDom(form);
// console.log(done);

export default class Dom{
  static #elementMain = document.querySelector("body > main");

  static render(dom){
    // If Passed Object Like: createElement("x-form")
    if(typeof dom === "object") Dom.#elementMain.replaceChildren(dom);

    // If Passed String Like: "<x-form></x-from>"
    else if(typeof dom === "string") Dom.#elementMain.innerHTML = dom;

    window.dispatchEvent(new CustomEvent("domChange"));

  }

  static jsonToDom(object){
    // Handle Invalid Types
    if(object == null) return;
    if(typeof object != "object") return;
    if(Object.keys(object).length !== 1) return;

    // Creating The Element
    const tagName = Object.keys(object)[0];
    const element = document.createElement(tagName);

    // Creating Attributes If Exists
    if("attributes" in object[tagName] && object[tagName]["attributes"].length > 0)
      for(const attribute of object[tagName]["attributes"])
        if(Object.keys(attribute).length === 1){
          const name = Object.keys(attribute)[0];
          const value = attribute[name];

          element.setAttribute(name, value);

        }

    // Creating Child Nodes If Exists
    if("childNodes" in object[tagName])
      for(const childNode of object[tagName]["childNodes"])
        element.appendChild(Dom.jsonToDom(childNode));

    return element;

  }

}

// const newDiv = document.createElement("div");
// const newContent = document.createTextNode("Hi there and greetings!");
// newDiv.appendChild(newContent);
