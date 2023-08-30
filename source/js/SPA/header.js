export default class Header{
  static selector = "body > header";
  static #element = null;
  static #contentFunc = null;
  static #isContentDefault = false;

  static init(){
    Header.#element = document.querySelector(Header.selector);

    // Initiate W/ Default Content
    Header.handle();
  }

  static async handle(headerFunc){
    // Check If Page Scoped header() Defined
    if(typeof headerFunc === "function"){
      // Once Header Function Passed From Outside
      // It's Definitely Not Default
      Header.#isContentDefault = false;

      // If header() Doesn Return False Then Execute It
      if(headerFunc() !== false) Header.#update(headerFunc());

      // Else Hide Header On This Page
      else Header.#hide();
    }

    // If No Talk To Default header.js
    else{

      try{
        Header.#contentFunc = await import(`../modules/header.js`);

      }catch(error){
        Header.#hide();
        return;

      }

      // Check If
      if(
         // header.js Has Default Method To Call
        typeof Header.#contentFunc.default === "function" &&
        // And Doesn Return False
        Header.#contentFunc.default() !== false
      )

      Header.#update();

      // Else Hide Header
      else Header.#hide();
    }

  }

  static #hide(){
    // Check If "body > header" Exists
    if(!!Header.#element === false) return;

    Header.#element.classList.add("hide");
  }

  static #show(){
    // Check If "body > header" Exists
    if(!!Header.#element === false) return;

    Header.#element.classList.remove("hide");
  }

  // When Called W/O Argument Will Update To Default Header View
  static #update(content = null){

    // Check If "body > header" Exists
    if(!!Header.#element === false) return;

    // If No Content Passed Update To Default
    if(!!content === false){

      // First Check If Header Has Still Default Content
      if(Header.#isContentDefault === false){
        Header.#element.innerHTML = Header.#contentFunc.default();
        Header.#show();
        Header.#isContentDefault = true;
      }

      // Exit The Update
      return;
    }

    // If Content Passed Update To Content
    Header.#element.innerHTML = content;
    Header.#show();
    Header.#isContentDefault = false;
  }
}

// Make Header Usable W/O Importing It
window.Header = Header;
