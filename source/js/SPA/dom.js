// import Dom from "./DOM.js";
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
// const done = DOM.jsonToDom(form);
// console.log(done);

// const newDiv = document.createElement("div");
// const newContent = document.createTextNode("Hi there and greetings!");
// newDiv.appendChild(newContent);


// else if(DOM.page.before.constructor.name === 'Function') DOM.page.before();

export default class DOM{
  static #elementMain = document.querySelector(window.Main.selector);
  static #page = null;

  static setPage(page){
    // Check If Page Is Valid
    if(!!page == false) return;

    // Update "page" Variable
    DOM.#page = page;

    // Start The Page's Life Cycle
    DOM.lifeCycle();

  }

  static async executeOnFormGotResponse(response){

    // If Async Function Passed Or Normal One
    if(DOM.#page.onFormGotResponse.constructor.name === 'AsyncFunction') await DOM.#page.onFormGotResponse(response);
    else DOM.#page.onFormGotResponse(response);

  }

  static async lifeCycle(){
    // Create Page Scoped Variable
    window.pageData = {};

    ////////// Title
    // Set Title
    window.Title.set(DOM.#page.TITLE);

    ////////// Content / Main
    ///// Before
    // Check If before() Exists
    if(!!DOM.#page.before === true)
      // If Async Function Passed Or Normal One
      if(DOM.#page.before.constructor.name === 'AsyncFunction') await DOM.#page.before();
      else DOM.#page.before();

    ///// Content - Render The Content
    // Check If Default Function Exists
    if(typeof DOM.#page.default === "function")
      // If Async Function Passed Or Normal One
      if(DOM.#page.default.constructor.name === 'AsyncFunction') DOM.render(await DOM.#page.default());
      else DOM.render(DOM.#page.default());

    else DOM.render("[DOM] Error: No Default Function Defined!");

    ///// After
    // Check If after() Exists
    if(!!DOM.#page.after === true)
      // If Async Function Passed Or Normal One
      if(DOM.#page.after.constructor.name === 'AsyncFunction') await DOM.#page.after();
      else DOM.#page.after();

    ////////// Footer
    // If User Defined footer() Exists Then Let Footer To Handle It
    // Else Pass Null Which Make Load Default Content
    window.Footer.handle(!!DOM.#page.footer === true ? DOM.#page.footer() : null);

    // Delete The Page Data At The End Of Each Life Cycle
    delete window.pageData;

  }

  static render(dom){
    // If Passed Object Like: createElement("x-form")
    if(typeof dom === "object") DOM.#elementMain.replaceChildren(dom);

    // If Passed String Like: "<x-form></x-from>"
    else if(typeof dom === "string") DOM.#elementMain.innerHTML = dom;

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
        element.appendChild(DOM.jsonToDom(childNode));

    return element;

  }

}

// Make DOM Usable W/O Importing It
window.DOM = DOM;
