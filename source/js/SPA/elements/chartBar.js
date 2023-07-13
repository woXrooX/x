"use strict";

export default class ChartBar extends HTMLElement{
  static #template = document.createElement("template");
  static {
    ChartBar.#template.innerHTML = `<canvas></canvas>`;
  }
  constructor(){
    super();

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});

    CSS: {
      const style = document.createElement('style');
      style.textContent = `
        ${CSS.rules.all}

        canvas{
          width: 1000px;
          height: 500px;

          border-radius: var(--radius);
          box-shadow: var(--shadow-default);
        }
      `;
      this.shadow.appendChild(style);
    }

    // Clone And Append Template
    this.shadow.appendChild(ChartBar.#template.content.cloneNode(true));

    ///// Data
    this.data = JSON.parse(this.innerHTML);
    // Max Value
    this.maxValue = 0;
    for(const entry of this.data.data) if(entry["value"] > this.maxValue) this.maxValue = entry["value"];

    ///// Canvas
    this.canvas = this.shadow.querySelector("canvas");
    this.canvas.width = this.canvas.getBoundingClientRect().width;
    this.canvas.height = this.canvas.getBoundingClientRect().height;
    // Context
    this.ctx = this.canvas.getContext("2d");
    // Canvas properties
    this.padding = 80;
    this.paddingLeft = this.padding * 1.5;
    this.paddingRight = this.padding * 0.5;
    this.width = this.canvas.getBoundingClientRect().width;
    this.height = this.canvas.getBoundingClientRect().height;

    ///// Main X,Y axes
    this.mainAxisLinesWidth = 2;

    ///// Title
    this.titleFontSize = "2rem";
    this.titleFont = "Quicksand";

    ///// X lines
    this.xLinesCount = this.data.yAxis.steps || 5;
    this.xLinesGap = (this.height - (this.padding * 2)) / (this.xLinesCount);

    ///// Bar
    this.barCount = this.data.data.length;
    // As bars get more, the gap gets bigger which leads to smaller bars
    this.barGap = 40 + (this.width / this.barCount / 100);
    this.barWidth = ((this.width - this.paddingLeft - this.paddingRight) / this.barCount) - this.barGap;
    this.barNameFontSize = "0.6rem";
    this.barNameFont = "Quicksand";
    this.barValueFontSize = "0.6rem";
    this.barValueFont = "Quicksand";
  }

  connectedCallback(){this.#drawAll();}

  ///// Helpers
  #drawBackground(){
    this.ctx.fillStyle = window.CSS.values.color.surface[9];
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  #drawXLines(){
    for(let i = 0; i < this.xLinesCount + 1; i++){
      // Draw x axis lines
      this.ctx.beginPath();
      this.ctx.moveTo(this.paddingLeft - 10, this.height - this.padding - (this.xLinesGap * i));
      this.ctx.lineTo(this.width - this.paddingRight, this.height - this.padding - (this.xLinesGap * i));
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeStyle = window.CSS.values.color.main;
      this.ctx.stroke();

      ///// Draw Heigts
      // Percentage
      const percentageOfHeights = i / this.xLinesCount * 100;

      // Value
      const maxValueByPercentage = this.maxValue * percentageOfHeights / 100;

      // Draw Bar Values
      this.ctx.font = `${this.barValueFontSize} ${this.barValueFont}`;
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "right";
      this.ctx.fillStyle = window.CSS.values.color.main;
      this.ctx.fillText(
        `${maxValueByPercentage.toFixed(1)} (${percentageOfHeights.toFixed(1)}%)`,
        this.paddingLeft - 20,
        this.height - this.padding - (this.xLinesGap * i)
      );
    }
  }

  #drawBars(){
    for(const i in this.data.data){
      // Draw bars
      const barHeight = ((this.height - (this.padding * 2)) * this.data.data[i]["value"]) / this.maxValue;
      const saturation = (((this.data.data[i]["value"] / this.maxValue) * (80 - 10)) + 10);
      const barStartsAtX = (this.barGap / 2) + this.paddingLeft + ((this.barGap + this.barWidth) * i);

      this.ctx.fillStyle = this.data.data[i]["color"] || `hsl(${window.CSS.values.color.brand.hue}deg, ${saturation}%, 10%)`;
      this.ctx.fillRect(
        barStartsAtX,
        this.height - this.padding - barHeight,
        this.barWidth,
        barHeight
      );

      // Draw names
      this.ctx.font = `${this.barNameFontSize} ${this.barNameFont}`;
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = window.CSS.values.color.main;
      this.ctx.fillText(
        this.data.data[i]["name"] || "Unknown",
        barStartsAtX + (this.barWidth / 2),
        this.height - (this.padding / 1.2)
      );
    }
  }

  #drawMainAxis(){
    this.ctx.beginPath();
    this.ctx.moveTo(this.paddingLeft, this.padding);

    this.ctx.lineTo(this.paddingLeft, this.height - this.padding);
    this.ctx.lineTo(this.width - this.paddingRight, this.height - this.padding);

    this.ctx.lineWidth = this.mainAxisLinesWidth;
    this.ctx.strokeStyle = window.CSS.values.color.main;
    this.ctx.stroke();
  }

  #drawTitle(){
    this.ctx.font = `${this.titleFontSize} ${this.titleFont}`;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = window.CSS.values.color.main;
    this.ctx.fillText(this.data.title, this.width / 2, this.padding / 2);
  }

  #drawAll(){
    this.#drawBackground();
    this.#drawXLines();
    this.#drawBars();
    this.#drawMainAxis();
    this.#drawTitle();
  };

}

window.customElements.define('x-chart-bar', ChartBar);

// Make ChartBar Usable W/O Importing It
window.ChartBar = ChartBar;
