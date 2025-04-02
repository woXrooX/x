export default class Tooltip extends HTMLElement{
  constructor(){
    super();

    this.RAW = this.innerHTML;

    // Clean up
    this.innerHTML = "";

    // Check if this has "selector" attribute
    if(this.hasAttribute("selector") === false) return;

    // Load the trigger element
    this.trigger = document.querySelector(this.getAttribute("selector"));

    // If no trigger element exit
    if(!!this.trigger === false) return;

    // Make trigger cursor pointer if event type is click
    if(this.getAttribute("event") === "click") this.trigger.style.cursor = "pointer";

    // Event attribute
    if(this.hasAttribute("event") === false) this.event = "hover";
    else this.event = this.getAttribute("event");

    // Init the content
    this.innerHTML += `<content><span></span>${this.RAW}</content>`;
    this.pointer = this.querySelector("content > span");
    this.content = this.querySelector("content");

    //// Identify event type
    // mouseover = hover = click on mobile
    // default is mouseover (hover)
    this.eventType = "mouseover";
    if(this.getAttribute("event") === "click") this.eventType = "click";

    // Listen to the event to show the content
    this.trigger.addEventListener(this.eventType, this.#show);
  }

  ////// Content UI/UX
  #show = ()=>{
    this.#setUpContentPositioning();
    this.content.classList.add("show");
    this.isShown = true;

    // Hover
    this.#onHoverTrigger();
    this.#onHoverContent();

    // Click
    this.#hideOnClickOutsideContentEvent();
  }

  #hide = ()=>{
    if(this.isShown === false) return;

    this.content.classList.remove("show");
    this.isTimerRunning = false;
    this.isShown = false;
  }

  #setUpContentPositioning = ()=>{
    // Gap between mouse and tooltip
    const gap = 40;
    const windowBorderPadding = 5;
    let left = event.clientX + window.scrollX - this.content.offsetWidth/2;
    let top = event.clientY + window.scrollY - this.content.offsetHeight/2 + gap;
    this.arrowPosition = "top";

    ////// Detect if an element's border is colliding or crossing the viewport
    // If left out of window
    if(event.clientX - this.content.offsetWidth <= 0)
      left = windowBorderPadding;

    // If right is out of window
    if(event.clientX + this.content.offsetWidth >= window.innerWidth)
      left = window.innerWidth - this.content.offsetWidth - windowBorderPadding;

    // If bottom is out of window
    if(event.clientY + this.content.offsetHeight + gap >= window.innerHeight){
      this.arrowPosition = "bottom";
      top = event.clientY + gap;
    }

    // Place tooltip relative to mouse position
    this.content.style.left = left+"px";
    this.content.style.top = top+"px";
    this.#setUpPointer();
  }

  #setUpPointer = ()=>{
    const size = 10;

    // Default arrow position: y: top, x: center
    const x = `-50%`;
    let y = `calc(-100% - ${size-2}px)`;

    if(this.arrowPosition === "bottom") y = `${size-2}px`;

    this.pointer.style = `
      width: ${size}px;
      height: ${size}px;
      background-color: inherit;

      position: absolute;
      top: 50%;
      left: 50%;

      transform-origin: center;
      transform: translate(${x}, ${y}) rotate(45deg);
    `;
  }

  ////// On hover the trigger
  #onHoverTrigger = ()=>{
    // Check if event type is hover (mouseover)
    if(this.eventType !== "mouseover") return;

    this.#stopTimer();

    this.trigger.addEventListener('mouseout', this.#resetTimer);
  }

  ////// On hover the content
  // Keep showing on hover the content
  #onHoverContent = ()=>{
    // Check if event type is hover (mouseover)
    if(this.eventType !== "mouseover") return;

    if(this.isShown == false) return;

    // Stop timer when mouse entered to the content
    this.content.addEventListener('mouseover', this.#stopTimer);

    // (Re)start timer when mouse goes out from the content
    this.content.addEventListener('mouseout', this.#resetTimer);
  }

  ////// Timer
  #startTimer = ()=>{
    if(this.isTimerRunning === true) return;
    this.timerID = setTimeout(this.#hide, 500);
    this.isTimerRunning = true;
  }

  #stopTimer = ()=>{
    if(this.isTimerRunning === false) return;
    clearTimeout(this.timerID);
    this.isTimerRunning = false;
  }

  #resetTimer = ()=>{
    this.#stopTimer();
    this.#startTimer();
  }

  ////// On click outside hide
  #hideOnClickOutsideContentEvent = ()=>{
    if(this.eventType !== "click") return;
    if(this.isShown === false) return;

    document.addEventListener("click", this.#hideOnClickOutsideContent);
  }

  #hideOnClickOutsideContent = ()=>{
    // Do nothing when clicked the content
    if(this.content.contains(event.target) === true) return;

    // Do nothing when clicked the trigger
    if(this.trigger.contains(event.target) === true) return;

    // Hide when clicked outside the content and the trigger
    this.#hide();

    // Remove event listener
    document.removeEventListener("click", this.#hideOnClickOutsideContent);
  }
};

customElements.define('x-tooltip', Tooltip);

// Make Tooltip Usable W/O Importing It
window.Tooltip = Tooltip;
