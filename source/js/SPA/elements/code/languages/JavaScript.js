export default class JavaScript{
  static #tokens = null;

  static handle(code){
    JavaScript.#tokenize(code);
    return JavaScript.#renderHighlightedCode();
  }

  static #tokenize(code){
    const keywords = ['if', 'else', 'while', 'for', 'function', 'var', 'let', 'const', 'return'];
    const operators = ['+', '-', '*', '/', '=', '==', '!=', '>', '<', '>=', '<=', '(', ')', '{', '}'];

    const tokens = [];
    let current = 0;

    while(current < code.length){
      let char = code[current];

      // Whitespace
      if([' ', '\s', '\t'].includes(char)){
        tokens.push({ type: 'whitespace', value: ' ' });

        current++;
        continue;
      }

      // Newline
      if(char == '\n'){
        tokens.push({ type: 'newline', value: '\n' });

        current++;
        continue;
      }

      // Comments
      if(char === '/' && code[current + 1] === '/'){
        let comment = '/';

        while(code[++current] !== '\n' && current < code.length) comment += code[current];

        comment += '\n'

        tokens.push({ type: 'comment', value: comment });

        current++;
        continue;
      }

      // Dot
      if(char === '.'){
        tokens.push({ type: 'dot', value: '.' });

        current++;
        continue;
      }

      // Semicolon
      if(char === ';'){
        tokens.push({ type: 'semicolon', value: ';' });

        current++;
        continue;
      }

      // Operators
      if(operators.includes(char)){
        let operator = char;

        while(operators.includes(operator + code[current + 1])) operator += code[++current];

        tokens.push({ type: 'operator', value: operator });

        current++;
        continue;
      }

      // Keywords and Identifiers
      if(/[a-zA-Z_]/.test(char)){
        let identifier = char;

        while(/[a-zA-Z0-9_]/.test(code[current + 1])) identifier += code[++current];

        if(keywords.includes(identifier)) tokens.push({ type: 'keyword', value: identifier });
        else tokens.push({ type: 'identifier', value: identifier });

        current++;
        continue;
      }

      // Handle numbers
      if(/[0-9]/.test(char)){
        let number = char;

        while(/[0-9.]/.test(code[current + 1])) number += code[++current];

        tokens.push({ type: 'number', value: parseFloat(number) });

        current++;
        continue;
      }

      // Handle strings
      if(char === '"' || char === "'"){
        let string = `"`;
        let quote = char;

        while(code[++current] !== quote) string += code[current];

        string += `"`;

        tokens.push({ type: 'string', value: string });

        current++;
        continue;
      }

      // Handle unrecognized characters
      tokens.push({ type: 'unknown', value: char });

      current++;
    }

    JavaScript.#tokens = tokens;
  }

  static #renderHighlightedCode(){
    let html = '';

    for(const token of JavaScript.#tokens){
      let tokenHtml = '';

      switch(token.type){
        case 'comment':
          tokenHtml = `<span style="color:gray;">${token.value}</span>`;
          break;

        case 'dot':
        case 'semicolon':
          tokenHtml = `<span style="color: white;">${token.value}</span>`;
          break;

        case 'operator':
          tokenHtml = `<span style="color: hsla(205, 100%, 83%, 1);">${token.value}</span>`;
          break;

        case 'keyword':
          tokenHtml = `<span style="color: hsla(286, 38%, 58%, 1);">${token.value}</span>`;
          break;

        case 'identifier':
          tokenHtml = `<span style="color: hsla(205, 100%, 48%, 1);">${token.value}</span>`;
          break;

        case 'number':
          tokenHtml = `<span style="color: hsla(33, 38%, 58%, 1);">${token.value}</span>`;
          break;

        case 'string':
          tokenHtml = `<span style="color: hsla(124, 38%, 58%, 1);">${token.value}</span>`;
          break;

        default:
          tokenHtml = `<span>${token.value}</span>`;
      }

      html += tokenHtml;
    }

    return html;
  }
};
