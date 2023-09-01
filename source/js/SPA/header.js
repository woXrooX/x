export default class Header{
  static selector = "body > header";
  static #element = null;
  static #contentFunc = null;

  static init(){
    Header.#element = document.querySelector(Header.selector);

    // Initiate W/ Default Content
    Header.handle();
  }

  static async handle(headerFunc){
    // Check If Page Scoped header() Defined
    if(typeof headerFunc === "function"){
      // If header() Doesn Return False Then Execute It
      if(headerFunc() !== false) Header.#build(headerFunc());

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
         // JS/header.js Has Default Method To Call
        typeof Header.#contentFunc.default === "function" &&
        // And Doesn Return False
        Header.#contentFunc.default() !== false
      ) Header.#build();

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
  static #build(content = null){
    Log.info("Header.#build()");

    // Check If "body > header" Exists
    if(!!Header.#element === false) return;

    // If No Content Passed Update To Default
    if(!!content === false){
      Header.#element.innerHTML = Header.#contentFunc.default();
      Header.#show();

      // Exit The Update
      return;
    }

    // If Content Passed Update To Content
    Header.#element.innerHTML = content;
    Header.#show();
  }
}

// Make Header Usable W/O Importing It
window.Header = Header;
