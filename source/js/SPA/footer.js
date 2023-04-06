// "demo": {
//   "enabled": true,
//   "allowed": ["everyone"],
//   "aliases": ["/demo"],
//   "footer": {"enabled": true} // Or False
// },


export default class Footer{
  static selector = "body > footer";
  static #element = null;
  static #isContentDefault = false;

  static init(){
    Footer.#element = document.querySelector(Footer.selector);

    // Initiate W/ Default Content
    Footer.update();

  }

  static handle(content){
    // If "footer" Exists In Page Configurations
    if("footer" in window.CONF["pages"][Router.currentPage]){

      // If "footer" Is Enabled Then Update
      if(window.CONF["pages"][Router.currentPage]["footer"]["enabled"] === true) window.Footer.update(content);

      // If "footer" Is Disabled Then Hide
      else window.Footer.hide();

    // If "footer" Doesn't Exists In Page Configurations
    // Show Footer By Default
    }else window.Footer.update(content);

  }

  // By Default Shown
  // static show(){
  //
  // }

  static hide(){Footer.#element.remove();}

  // When Called W/O Argument Will Update To Default Footer View
  static update(content = null){
    // Check If "body > footer" Exists
    if(!!Footer.#element === false) return;

    // If No Content Passed Update To Default
    if(!!content === false){

      // First Check If Footer Has Still Default Content
      if(Footer.#isContentDefault === false){
        Footer.#element.innerHTML = "Default";
        Footer.#isContentDefault = true;
      }

      // Exit The Update
      return;

    }

    // If Content Passed Update To Content
    Footer.#element.innerHTML = content;
    Footer.#isContentDefault = false;

  }

}

// Make Footer Usable W/O Importing It
window.Footer = Footer;
