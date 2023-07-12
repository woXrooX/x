"use strict";

function drawLine(ctx, startX, startY, endX, endY,color){
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();

  // set the starting point
  ctx.moveTo(startX,startY);
  
  // to indicate the end point
  ctx.lineTo(endX,endY);

  ctx.stroke();
  ctx.restore();
}

function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, color, padding){
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(upperLeftCornerX + padding, upperLeftCornerY + padding, width - 2 * padding, height + 45);
  ctx.restore();
}

export default class BarChart extends HTMLElement{
  static #template = document.createElement("template");
  static {
    BarChart.#template.innerHTML = `
      <section>
        <canvas></canvas>
        <legend></legend>
      </section>
    `;
  }
  constructor() {
    super();

    // Closed
    this.shadow = this.attachShadow({mode: 'closed'});

    CSS: {
      const style = document.createElement('style');
      style.textContent = `
        canvas{
          width: 1000px;
          height: 500px;
        }
        legend > ul{
          display: flex;
          gap: 30px;
        }
      `;
      this.shadow.appendChild(style);
    }

    // Clone And Append Template
    this.shadow.appendChild(BarChart.#template.content.cloneNode(true));
    
    const options = JSON.parse(this.getAttribute('data-json'));
    const canvas = this.shadow.querySelector("section > canvas");
    
    this.options = options;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.titleOptions = options.titleOptions;
    this.maxValue = Math.max(...Object.values(this.options.data));
    let numberOfBars = Object.keys(this.options.data).length;
    
    // Random color generator
    // Check if color param is empty
    if(options.colors.length !== 0) this.colors = options.colors; 
    let randomColors = [];
    for (let i = 0; i < numberOfBars; i++) {
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      randomColors.push("#" + randomColor)
    }
    this.colors = randomColors;     

  }

  connectedCallback() {
    this.draw();
  }
  
   // drawing the grid lines
   drawGridLines() {
    let canvasActualHeight = this.canvas.height - this.options.padding * 2;
    let canvasActualWidth = this.canvas.width - this.options.padding * 2;
    let gridValue = 0;
    while (gridValue <= this.maxValue) {
      let gridY = canvasActualHeight * (1 - gridValue / this.maxValue) + this.options.padding;
      drawLine(
        this.ctx,
        0,
        gridY,
        this.canvas.width,
        gridY,
        this.options.gridColor,
      );
      drawLine(
        this.ctx,
        15,
        this.options.padding / 2,
        15,
        gridY + this.options.padding / 2,
        this.options.gridColor,
      );
      // Writing grid markers 
      this.ctx.save();
      this.ctx.globalAlpha = this.options.gridOpacity; // Set the desired opacity for grid lines
      this.ctx.fillStyle = this.options.gridColor;
      this.ctx.textBaseline = "bottom";
      this.ctx.font = "bold 10px Arial";
      this.ctx.fillText(gridValue, 0, gridY - 2);
      this.ctx.restore();
      gridValue += this.options.gridScale;
    }
  }

  // drawing the bars of the chart
  drawBars() {
    let canvasActualHeight = this.canvas.height - this.options.padding * 2;
    let canvasActualWidth = this.canvas.width - this.options.padding * 2;
    let barIndex = 0;
    let padding = 10;
    let barCount = Object.keys(this.options.data).length;
    let barSize = (canvasActualWidth - (barCount - 1) * this.options.barSpacing) / barCount;
    let values = Object.values(this.options.data);
    let keys = Object.keys(this.options.data);

    for (let i = 0; i < values.length; i++) {
      let val = values[i];
      let key = keys[i];
      let barHeight = (canvasActualHeight * val) / this.maxValue;

      drawBar(
        this.ctx,
        this.options.padding + barIndex * (barSize + this.options.barSpacing),
        this.canvas.height - barHeight - this.options.padding,
        barSize,
        barHeight,
        this.colors[barIndex % this.colors.length],
        padding
      );

      // Draw data name at the bottom
      this.ctx.save();
      this.ctx.fillStyle = "black";
      this.ctx.textAlign = "center";
      this.ctx.font = "12px Arial";
      this.ctx.fillText(key, this.options.padding + barIndex * (barSize + this.options.barSpacing) + barSize / 2, this.canvas.height - this.options.padding + 20);
      this.ctx.restore();

      barIndex++;
    }
  }

  drawLabel() {
    this.ctx.save();
    this.ctx.textBaseline = "top";
    this.ctx.textAlign = this.titleOptions.align;
    this.ctx.fillStyle = this.titleOptions.fill;
    this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`;
    let xPos = this.canvas.width / 2;

    if (this.titleOptions.align == "left") xPos = 10;
    if (this.titleOptions.align == "right") xPos = this.canvas.width - 10;

    this.ctx.fillText(this.options.seriesName, xPos, 0);
    this.ctx.restore();
  }


  draw =()=> {
    this.drawGridLines();
    this.drawBars();
    this.drawLabel();
  }
 
}
customElements.define('x-chart', BarChart);