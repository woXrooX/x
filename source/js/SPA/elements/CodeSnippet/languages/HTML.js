export default class HTML{
  static #tokens = [];
  static #current = 0;
  static #code;

  static handle(code){
    HTML.#code = code;
    HTML.#tokenize();
    return HTML.#renderHighlightedCode();
  }

  static #renderHighlightedCode(){
    let html = '';

    for(const token of HTML.#tokens){
      let tokenHtml = '';

      switch(token.type){
        case 'comment':
          tokenHtml = `<span style="color: grey;">${token.value}</span>`;
          break;

        case 'symbol':
          tokenHtml = `<span style="color: white;">${token.value}</span>`;
          break;

        case 'string':
          tokenHtml = `<span style="color: hsla(124, 38%, 58%, 1);">${token.value}</span>`;
          break;

        case 'elementName':
          tokenHtml = `<span style="color: red;">${token.value}</span>`;
          break;

        case 'attribute':
          tokenHtml = `<span style="color: orange;">${token.value}</span>`;
          break;

        case 'text':
          tokenHtml = `<span style="color: white;">${token.value}</span>`;
          break;

        case 'whitespace':
          tokenHtml = `<span>${token.value}</span>`;
          break;

        case 'newline':
          tokenHtml = `<span>${token.value}</span>`;
          break;

        default: tokenHtml = `<span style="color: grey;">${token.value}</span>`;
      }

      html += tokenHtml;
    }

    return html;
  }

  ////// Tokenizer & Helpers
  static #tokenize(){
    Main: while(HTML.#current < HTML.#code.length){
      // ' '
      if(HTML.#code[HTML.#current] === ' '){
        HTML.#handleWhitespace();
      }

      // '\n'
      if(HTML.#code[HTML.#current] === '\n'){
        HTML.#handleNewLine();
      }

      // Element & attributes start
      // '<'
      if(HTML.#code.substring(HTML.#current, HTML.#current+4) === "&lt;"){
        HTML.#handleElement();
      }

      HTML.#tokens.push({type: 'text', value: HTML.#code[HTML.#current]});
      HTML.#current++;
    }
  }

  static #handleComment(){
    HTML.#current += 7;

    HTML.#tokens.push({type: 'comment', value: "&lt;-- "});

    while(HTML.#code.substring(++HTML.#current, HTML.#current+4) !== "&gt;" && HTML.#current < HTML.#code.length)
      HTML.#tokens.push({type: 'comment', value: HTML.#code[HTML.#current]});

    HTML.#tokens.push({type: 'comment', value: "&gt;"});

    HTML.#current += 4;
  }

  static #handleWhitespace(){
    HTML.#tokens.push({type: 'whitespace', value: ' '});
    HTML.#current++;
  }

  static #handleNewLine(){
    HTML.#tokens.push({type: 'newline', value: '\n'});
    HTML.#current++;
  }

  static #handleElement(){
    // Comment
    if(HTML.#code.substring(HTML.#current+4, HTML.#current+7) === "!--"){
      HTML.#handleComment();
      return;
    }

    // Or normal opening
    else HTML.#handleSymbols('<', 3);

    // Loop until receiving ">"
    while(HTML.#code[++HTML.#current] !== "&gt;" && HTML.#current < HTML.#code.length){
      // = /
      if(
        HTML.#code[HTML.#current] === '=' ||
        HTML.#code[HTML.#current] === '/' ||
        HTML.#code[HTML.#current] === '!'
      ) HTML.#handleSymbols();

      // ' '
      if(HTML.#code[HTML.#current] === ' ') HTML.#handleWhitespace();

      // String
      if(HTML.#code[HTML.#current] === '"' || HTML.#code[HTML.#current] === "'") HTML.#handleString();

      // '>'
      if(HTML.#code.substring(HTML.#current, HTML.#current+4) === "&gt;"){
        HTML.#handleSymbols('>', 4);
        break;
      }

      // Anything else = attributes
      HTML.#tokens.push({type: 'attribute', value: HTML.#code[HTML.#current]});
    }
  }

  // Symbols inside element: meaning < / ! - =  "" >
  static #handleSymbols(symbol = null, length = 1){
    HTML.#tokens.push({type: 'symbol', value: symbol || HTML.#code[HTML.#current]});
    HTML.#current += length;
  }

  static #handleString(){
    let string = `"`;
    let quote = HTML.#code[HTML.#current];

    while(HTML.#code[++HTML.#current] !== quote && HTML.#current < HTML.#code.length) string += HTML.#code[HTML.#current];

    string += `"`;

    HTML.#tokens.push({type: 'string', value: string});

    HTML.#current++;
  }
};
