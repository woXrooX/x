// "demo": {
//   "enabled": true,
//   "allowed": ["everyone"],
//   "aliases": ["/demo"],
//   "footer": {"enabled": true} // Or False
// },


export default class Footer{
  static selector = "body > footer";
  static #element = null;
  static #contentFunc = null;
  static #isContentDefault = false;

  static init(){
    Footer.#element = document.querySelector(Footer.selector);

    // Initiate W/ Default Content
    Footer.handle();

  }

  static async handle(footerFunc){
    // Check If Page Scoped footer() Defined
    if(typeof footerFunc === "function"){
      // Once Footer Function Passed From Outside
      // It's Definitely Not Default
      Footer.#isContentDefault = false;

      // If footer() Doesn Return False Then Execute It
      if(footerFunc() !== false) Footer.#update(footerFunc());

      // Else Hide Footer On This Page
      else Footer.#hide();

    }

    // If No Talk To Default footer.js
    else{

      try{
       Footer.#contentFunc = await import(`../modules/footer.js`);


      }catch(error){
        Footer.#hide();
        return;
      }

      // Check If
      if(
         // footer.js Has Default Method To Call
        typeof Footer.#contentFunc.default === "function" &&
        // And Doesn Return False
        Footer.#contentFunc.default() !== false
      )

        Footer.#update();

      // Else Hide Footer
      else Footer.#hide();

    }

  }

  static #hide(){
    // Check If "body > footer" Exists
    if(!!Footer.#element === false) return;

    Footer.#element.style.display = "none";

  }

  static #show(){
    // Check If "body > footer" Exists
    if(!!Footer.#element === false) return;

    Footer.#element.removeAttribute("style");

  }

  // When Called W/O Argument Will Update To Default Footer View
  static #update(content = null){

    // Check If "body > footer" Exists
    if(!!Footer.#element === false) return;

    // If No Content Passed Update To Default
    if(!!content === false){

      // First Check If Footer Has Still Default Content
      if(Footer.#isContentDefault === false){
        Footer.#element.innerHTML = Footer.#contentFunc.default();
        Footer.#show();
        Footer.#isContentDefault = true;
      }

      // Exit The Update
      return;

    }

    // If Content Passed Update To Content
    Footer.#element.innerHTML = content;
    Footer.#show();
    Footer.#isContentDefault = false;

  }

}

// Make Footer Usable W/O Importing It
window.Footer = Footer;
