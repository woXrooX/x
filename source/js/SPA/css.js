const buttonStyles = `
  background-color: blue;
  color: white;
  padding: 10px;
  border-radius: 5px;
`;

const button = document.createElement('button');
button.style.cssText = buttonStyles;
button.textContent = 'Click me';
document.body.appendChild(button);
