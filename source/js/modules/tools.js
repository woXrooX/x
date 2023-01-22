export function elementExists(selector){
  const element = document.querySelector(selector);

  return !!element;
  
}
