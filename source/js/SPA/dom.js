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

// const newDiv = document.createElement("div");
// const newContent = document.createTextNode("Hi there and greetings!");
// newDiv.appendChild(newContent);


// else if(Dom.page.before.constructor.name === 'Function') Dom.page.before();

export default class Dom{
  static #elementMain = document.querySelector("body > main");
  static #page = null;

  static setPage(page){
    // Check If Page Is Valid
    if(!!page == false) return;

    // Update "page" Variable
    Dom.page = page;

    // Start The Page's Life Cycle
    Dom.lifeCycle();

  }

  static async lifeCycle(){
    // Create Page Scoped Variable
    window.pageData = {};

    // Set Title
    window.Title.set(Dom.page.TITLE);

    ///// Before
    // Check If before() Exists
    if(!!Dom.page.before === true)
      // If Async Function Passed Or Normal One
      if(Dom.page.before.constructor.name === 'AsyncFunction') await Dom.page.before();
      else Dom.page.before();

    ///// Content - Render The Content
    // Check If Default Function Exists
    if(typeof Dom.page.default === "function")
      // If Async Function Passed Or Normal One
      if(Dom.page.default.constructor.name === 'AsyncFunction') Dom.render(await Dom.page.default());
      else Dom.render(Dom.page.default());

    else Dom.render("[DOM] Error: No Default Function Defined!");

    ///// After
    // Check If after() Exists
    if(!!Dom.page.after === true)
      // If Async Function Passed Or Normal One
      if(Dom.page.after.constructor.name === 'AsyncFunction') await Dom.page.after();
      else Dom.page.after();

    // Delete The Page Data At The End Of Each Life Cycle
    delete window.pageData;

  }

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

// Make Dom Usable W/O Importing It
window.Dom = Dom;
