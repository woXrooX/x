"use strict";

// import {name} from "../modules/tools.js"

export function observe(
  selector,
  onObservedAddClassName,
  onOutOfObservingRemoveClass = false,
  options={
    threshhold: 0,
    rootMargin: "0px"
  }
){

  const observer = new IntersectionObserver(elements =>{
    for(const element of elements)
      if(element.isIntersecting) element.target.classList.add(onObservedAddClassName);
      else if(onOutOfObservingRemoveClass === true) element.target.classList.remove(onObservedAddClassName);

  },options);

  const elements = document.querySelectorAll(selector);

  if(!!elements === false) return;

  for(const element of elements) observer.observe(element);

}

// Make observe() Usable W/O Importing It
window.observe = observe;
