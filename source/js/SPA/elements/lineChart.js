"use strict";

export default class LineChart extends HTMLElement{
  constructor(){
    super();

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});

    CSS: {
      const style = document.createElement('style');
      style.textContent = `
        canvas{
          width: auto;
          height: auto;

          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }
      `;
      this.shadow.appendChild(style);
    }

    ///// Data
    this.data = JSON.parse(this.innerHTML);

    //// Max-Min Values
    // Max Value
    this.maxValue = 0;
    // Min Value
    this.minValue = this.data.data[0].values[0];

    for(const line of this.data.data)
      for(const value of line.values){
        if(this.maxValue < value) this.maxValue = value;
        if(this.minValue > value) this.minValue = value;
      }

    ///// Canvas
    this.canvas = document.createElement("canvas");
    this.shadow.appendChild(this.canvas);

    this.canvas.width = this.data["width"];
    this.canvas.height = this.data["height"];

    // Context
    this.ctx = this.canvas.getContext("2d");
    // Canvas properties
    this.padding = 80;
    this.paddingLeft = this.padding;
    this.paddingRight = this.padding * 0.5;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    ///// Title
    this.titleFontSize = "2rem";
    this.titleFont = "Quicksand";

    ///// Main X,Y axes
    this.mainAxisLinesWidth = 2;
    this.mainAxisLabelsPadding = 20;
    this.gridLinesWidth = 0.5;
    this.gridPointersToMainAxisLabelsLength = 10;


    ///// X lines
    this.xLinesCount = this.data.yAxis.steps || 5;
    this.xLinesGap = (this.height - (this.padding * 2)) / (this.xLinesCount);

    ///// Y lines
    this.yLinesCount = this.data.xAxis.labels.length;
    this.yLinesGap = (this.width - (this.paddingLeft + this.paddingRight)) / (this.yLinesCount);
  }

  connectedCallback(){this.#drawAll();}

  ///// Helpers
  #drawBackground(){
    this.ctx.fillStyle = window.CSS.getValue("--color-main-tint-9");
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  #drawXLines(){
    const stepGap = this.maxValue / this.xLinesCount;

    for(let i = 0; i < this.xLinesCount + 1; i++){
      // Draw x axis lines
      this.ctx.beginPath();
      this.ctx.moveTo(this.paddingLeft - this.gridPointersToMainAxisLabelsLength, this.height - this.padding - (this.xLinesGap * i));
      this.ctx.lineTo(this.width - this.paddingRight, this.height - this.padding - (this.xLinesGap * i));
      this.ctx.lineWidth = this.gridLinesWidth;
      this.ctx.strokeStyle = window.CSS.getValue("--color-main");
      this.ctx.stroke();

      // Percentage
      const percentageOfHeights = i / this.xLinesCount * 100;

      // Value
      const maxValueByPercentage = this.maxValue * percentageOfHeights / 100;

      // Draw Label Values
      this.ctx.font = "0.6rem";
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "right";
      this.ctx.fillStyle = window.CSS.getValue("--color-main");
      this.ctx.fillText(
        `${stepGap * i}`,
        this.paddingLeft - this.mainAxisLabelsPadding,
        this.height - this.padding - (this.xLinesGap * i)
      );

    }

  }

  #drawYLines(){
    for(let i = 0; i < this.yLinesCount + 1; i++){
      // Draw y-axis lines
      this.ctx.beginPath();
      this.ctx.moveTo(this.paddingLeft + (i * this.yLinesGap), this.padding);
      this.ctx.lineTo(this.paddingLeft + (i * this.yLinesGap), this.height - this.padding + this.gridPointersToMainAxisLabelsLength);
      this.ctx.lineWidth = this.gridLinesWidth;
      this.ctx.strokeStyle = window.CSS.getValue("--color-main");
      this.ctx.stroke();

      // Draw Label Values
      this.ctx.font = "0.6rem";
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = window.CSS.getValue("--color-main");
      this.ctx.fillText(
        this.data["xAxis"]["labels"][i] || "",
        this.paddingLeft + (i * this.yLinesGap),
        this.height - this.padding + this.mainAxisLabelsPadding
      );

    }
  }

  #drawDataLines(){
    const effectiveHeight = this.height - (2 * this.padding);
    let prevCords = {
      x: 0,
      y: 0
    }

    for(let line = 0; line < this.data.data.length; line++)
      for(let value = 0; value < this.data.data[line].values.length; value++){

        // N % of max value
        const nPercentageOfMaxValue = (this.data.data[line].values[value] / this.maxValue) * 100;

        // Current cords
        let x = this.paddingLeft + this.yLinesGap * value;
        let y = this.height - this.padding - (nPercentageOfMaxValue/100*effectiveHeight);

        this.ctx.beginPath();
        this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.data.data[line].color;
        this.ctx.fill();

        // Reset the prev x and y
        if(value == 0){
          prevCords.x = x;
          prevCords.y = y;
        }

        // Connector lines
        this.ctx.beginPath();
        this.ctx.moveTo(prevCords.x, prevCords.y);
        this.ctx.lineTo(x, y);
        this.ctx.lineWidth = this.gridLinesWidth * 5;
        this.ctx.strokeStyle = this.data.data[line].color;
        this.ctx.stroke();

        // Update prev cords
        prevCords.x = x;
        prevCords.y = y;
      }
  }

  #drawMainAxis(){
    this.ctx.beginPath();
    this.ctx.moveTo(this.paddingLeft, this.padding);

    this.ctx.lineTo(this.paddingLeft, this.height - this.padding);
    this.ctx.lineTo(this.width - this.paddingRight, this.height - this.padding);

    this.ctx.lineWidth = this.mainAxisLinesWidth;
    this.ctx.strokeStyle = window.CSS.getValue("--color-main");
    this.ctx.stroke();
  }

  #drawTitle(){
    this.ctx.font = `${this.titleFontSize} ${this.titleFont}`;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = window.CSS.getValue("--color-main");
    this.ctx.fillText(this.data.title, this.width / 2, this.padding / 2);
  }

  #drawAll(){
    this.#drawBackground();
    this.#drawXLines();
    this.#drawYLines();
    this.#drawMainAxis();
    this.#drawDataLines()
    this.#drawTitle();
  };

}

window.customElements.define('x-line-chart', LineChart);

// Make LineChart Usable W/O Importing It
window.LineChart = LineChart;
