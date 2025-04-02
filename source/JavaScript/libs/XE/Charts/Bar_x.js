// Usage:
// <x-bar-x-chart>
// 	{
// 		"sorted": true,
// 		"hue": 231,
// 		"bar": {
// 			"radius": 5,
// 			"values": {
// 				"numeric": false,
// 				"percentage": true
// 			}
// 		},
// 		"x_axis": {
// 			"line": {
// 				"line_dash": 5,
// 				"color": "white"
// 			},
// 			"marker": {
// 				"color": "white",
//				"count": 10
// 			}
// 		},
// 		"y_axis": {
// 			"line": {
// 				"line_dash": 5,
// 				"color": "white"
// 			},
// 			"marker": {
// 				"color": "white",
// 				"position": "on_bars"
// 			}
// 		},
// 		"grid": {
// 			"line_dash": 5,
// 			"color": "red"
// 		},
// 		"datasets": [
// 			{
// 				"label": "woXrooX",
// 				"value": 150
// 			},
// 			{
// 				"label": "Connexion",
// 				"value": 90
// 			},
// 			{
// 				"label": "Datalyse",
// 				"value": 200
// 			}
// 		]
// 	}
// </x-bar-x-chart>

export default class Bar_x extends HTMLElement {
	#data;
	#canvas;
	#ctx;
	#resize_observer_object = null;
	#tooltip;

	#font_family = "Quicksand";
	#hue = "230deg";

	#max_value = 0;
	#padding = 20;
	#paddings = {};
	#x_axis_marker_count = 5;
	#x_axis_marker_gap = 0;
	#x_axis_step_value = 0;

	#bars = [];
	#total_value = 0;
	#bar_width = 60;
	#bar_gap = 10;
	#border_radius = 5;
	#bar_scale = 0;
	#canvas_DPI_width;
	#canvas_DPI_height;

	#parent_node_height;

	constructor(){
		super();

		this.shadow = this.attachShadow({ mode: "closed" });

		this.#data = JSON.parse(this.innerHTML).constructor === Object ? JSON.parse(this.innerHTML) : {};

		if (!("datasets" in this.#data) || this.#data["datasets"].length === 0) {
			this.shadow.innerHTML = "Bar_x: Invalid JSON";
			return;
		}

		// Style element
		const style = document.createElement("style");
		style.textContent = `
			:host{
				display: inline-block;
				width: 100%;
				height: 100%;
				max-width: 100dvw;
				max-height: 100dvh;
			}
			canvas{
				width: 100%;
				height: 100%;
			}
			div#XE_charts_bar_x_tooltip{
				position: absolute;
				display: none;
				background-color: rgba(0, 0, 0, 0.7);
				color: white;
				padding: 5px;
				border-radius: 5px;
				pointer-events: none;
				font-size: 0.6em;
			}
		`;
		this.shadow.appendChild(style);

		// Tooltip element
		this.#tooltip = document.createElement("div");
		this.#tooltip.setAttribute("id", "XE_charts_bar_x_tooltip");
		this.shadow.appendChild(this.#tooltip);

		// Canvas element
		this.#canvas = document.createElement("canvas");
		this.shadow.appendChild(this.#canvas);
		this.#ctx = this.#canvas.getContext("2d");
	}

	connectedCallback() {
		this.#resize_observer();
		this.#init_on_hover_bar();
	}

	disconnectedCallback() {
		// Clean up the observer when element is removed
		if (this.#resize_observer_object) {
		  this.#resize_observer_object.disconnect();
		  this.#resize_observer_object = null;
		}
	}

	////// APIs
	#resize_observer(){
		this.#resize_observer_object = new ResizeObserver(this.#init);
		this.#resize_observer_object.observe(this.parentNode);
	}

	#init = ()=>{
		this.#set_up_canvas();
		this.#init_values();
		this.#calculate_values();
		this.#init_bars();

		this.#draw_y_axis_grid_lines();

		this.#draw_bars();
		this.#draw_bar_values();

		this.#draw_x_axis_markers();
		this.#draw_x_axis_line();

		this.#draw_y_axis_line();
		this.#draw_y_axis_markers();
	}

	////// Helpers
	#set_up_canvas(){
		const DPR = window.devicePixelRatio || 1;

		// First set CSS dimensions
		this.#canvas.style.width = '100%';
		this.#canvas.style.height = '100%';

		// Get the size in CSS pixels after CSS is applied
		const computed_style = getComputedStyle(this.#canvas);
		const css_width = parseFloat(computed_style.width);
		const css_height = parseFloat(computed_style.height);

		// Get the sizes before DPI scaling for calcs
		this.#canvas_DPI_width = css_width;
		this.#canvas_DPI_height = css_height;
		this.#parent_node_height = getComputedStyle(this.parentNode).height;

		// Adjust canvas buffer size for DPR
		this.#canvas.width = css_width * DPR;
		this.#canvas.height = css_height * DPR;

		// Scale the context for DPR
		this.#ctx.scale(DPR, DPR);
	}

	#init_values(){
		if("hue" in this.#data) this.#hue = this.#data["hue"];
		if("font_family" in this.#data) this.#font_family = this.#data["font_family"];
		if("bar" in this.#data && "radius" in this.#data["bar"]) this.#border_radius = this.#data["bar"]["radius"];
		if("x_axis" in this.#data && "marker" in this.#data["x_axis"] && "count" in this.#data["x_axis"]["marker"]) this.#x_axis_marker_count = this.#data["x_axis"]["marker"]["count"];

		this.#paddings = {
			top: this.#padding,
			right: this.#canvas_DPI_width - this.#padding,
			bottom: this.#canvas_DPI_height - this.#padding,
			left: this.#padding
		};
	}

	#calculate_values(){
		let longest_label = this.#data["datasets"][0]["label"];

		// Find max value and longest label name
		if(this.#max_value == 0) for(const bar of this.#data["datasets"]){
			if(bar["value"] > this.#max_value) this.#max_value = bar["value"];
			if(bar["label"].length > longest_label.length) longest_label = bar["label"];
		}

		// Set font to measure width correctly
		this.#ctx.font = `1em ${this.#font_family}`;

		// Max value width as a text
		let max_numeric_value_text_width = this.#ctx.measureText(this.#max_value).width;

		// Longest label name width
		let longest_label_text_width = this.#ctx.measureText(longest_label).width + this.#padding;

		let max_percentage_value_text_width = this.#ctx.measureText("(100%)").width;

		// Extract real area width of bars being drawed, remove paddings from 2 sides
		let raw_bar_area_width = this.#canvas_DPI_width - this.#padding * 2;

		// Bar scale, needs to remove left and right padding (2x)
		this.#bar_scale = raw_bar_area_width / this.#max_value;

		// Get text width of bar values
		let bar_value_text_width = 0;
		if("bar" in this.#data && "values" in this.#data["bar"]){
			if(this.#data["bar"]["values"]["numeric"] == true && this.#data["bar"]["values"]["percentage"] == true) bar_value_text_width = max_numeric_value_text_width + max_percentage_value_text_width;
			else if(this.#data["bar"]["values"]["percentage"] == true) bar_value_text_width = max_percentage_value_text_width;
			else if(this.#data["bar"]["values"]["numeric"] == true) bar_value_text_width = max_numeric_value_text_width;
		}

		// If values are true, make space
		if(bar_value_text_width > 0 && this.#data?.["y_axis"]?.["marker"]?.["position"] != "on_bars"){
			this.#paddings["right"] -= bar_value_text_width + this.#padding;
			this.#bar_scale = (raw_bar_area_width - bar_value_text_width - this.#padding) / this.#max_value;
		}

		// If y_axis values are true, make space
		if(
			"y_axis" in this.#data &&
			"marker" in this.#data["y_axis"] &&
			this.#data["y_axis"]?.["marker"]?.["position"] !== "on_bars"
		){
			this.#paddings["left"] += longest_label_text_width;
			this.#bar_scale = (raw_bar_area_width - this.#paddings["left"] + this.#padding) / this.#max_value;

			// If both y_axis values and bar values are true, make space for both of them
			if(bar_value_text_width > 0) this.#bar_scale = (raw_bar_area_width - this.#paddings["left"] - bar_value_text_width) / this.#max_value;
		}

		// If y_axis markers are true, make space
		if("x_axis" in this.#data && "marker" in this.#data["x_axis"]) this.#paddings["bottom"] -= max_numeric_value_text_width + this.#padding;

		// Bar gap, minimum good looking is 5
		this.#bar_gap = this.#parent_node_height * 0.01 > 5 ? this.#parent_node_height * 0.01 : 5;

		// calc bar width, based on value after removing top-bottom padding, and gaps
		this.#bar_width = (this.#paddings["bottom"] - this.#paddings["top"] - (this.#bar_gap * this.#data["datasets"].length)) / this.#data["datasets"].length;

		const max_bar_width = 100;
		const max_bar_width_gap = this.#bar_gap * 10;
		const total_bars_space = ((max_bar_width + max_bar_width_gap) * this.#data["datasets"].length) - max_bar_width_gap;
		const total_available_space = this.#paddings.bottom - this.#paddings.top;
		if (this.#bar_width > max_bar_width && (total_available_space > total_bars_space)) {
			this.#bar_width = max_bar_width;
			this.#bar_gap = max_bar_width_gap;
		}

		// x_axis markers gap, based on bar area width (which is after removing left-right paddings)
		// marker count - 1 to make space for 0.
		this.#x_axis_marker_gap = (this.#paddings["right"] - this.#paddings["left"]) / (this.#x_axis_marker_count - 1);
		this.#x_axis_step_value = this.#max_value / (this.#x_axis_marker_count - 1);

		// If sorted
		if(this.#data["sorted"] == true) this.#data["datasets"].sort((a, b) => b["value"] - a["value"]);
	}

	#init_bars(){
		const sorted_bar_values = [];
		this.#total_value = 0;
		for(const bar of this.#data["datasets"]){
			this.#total_value += bar["value"];
			sorted_bar_values.push(bar["value"]);
		}
		sorted_bar_values.sort((a, b) => b - a);

		const total_bars_space = ((this.#bar_width + this.#bar_gap) * this.#data["datasets"].length) - this.#bar_gap;
		const y_offset = ((this.#paddings.bottom - this.#paddings.top) - total_bars_space) / 2;
		this.#bars = [];
		for(let i = 0; i < this.#data["datasets"].length; i++){
			// Prevent minus values
			let bar_value = this.#data["datasets"][i]["value"] > 0 ? this.#data["datasets"][i]["value"] : 0;

			let y = i * (this.#bar_width + this.#bar_gap) + y_offset + this.#paddings["top"];
			let x = this.#paddings["left"];
			let height = this.#bar_width;
			let width = bar_value * this.#bar_scale;

			const index_of_this_value = sorted_bar_values.indexOf(this.#data["datasets"][i]["value"]);
			const saturation = 20 + (60 / (this.#data["datasets"].length)) * index_of_this_value;
			const lightness = 20 + (60 / (this.#data["datasets"].length)) * index_of_this_value;

			let bar_percentage = ((this.#data["datasets"][i]["value"] / this.#total_value) * 100).toFixed(1);

			let display_value = '';
			if("bar" in this.#data && "values" in this.#data["bar"]){
				if(this.#data["bar"]["values"]["numeric"] == true && this.#data["bar"]["values"]["percentage"] == true) display_value = `${this.#data["datasets"][i]["value"]} (${bar_percentage})%`;
				else if(this.#data["bar"]["values"]["percentage"] == true) display_value = `${bar_percentage}%`;
				else if(this.#data["bar"]["values"]["numeric"] == true) display_value = `${this.#data["datasets"][i]["value"]}`;
			}

			this.#bars.push({
				x: x,
				y: y,
				width: width,
				height: height,
				label: this.#data["datasets"][i]["label"],
				value: this.#data["datasets"][i]["value"],
				display_value: display_value,
				color: `hsl(${this.#hue}, ${saturation}%, ${lightness}%)`,
				radius: this.#border_radius
			});
		}
	}

	#draw_bars(){
		for(const bar of this.#bars){
			this.#ctx.beginPath();
			this.#ctx.setLineDash([0]);
			this.#ctx.fillStyle = bar["color"];
			this.#ctx.strokeStyle = bar["color"];
			this.#ctx.roundRect(bar["x"], bar["y"], bar["width"], bar["height"], this.#border_radius);
			this.#ctx.fill();
			this.#ctx.stroke();
			this.#ctx.closePath();
		}
	}

	#draw_bar_values(){
		if(
			!("bar" in this.#data) ||
			!("values" in this.#data["bar"]) ||
			this.#data["bar"]["values"]["numeric"] == false &&
			this.#data["bar"]["values"]["percentage"] == false
		) return;

		if (this.#data["y_axis"]?.["marker"]?.["position"] === "on_bars") return;

		for(const bar of this.#bars){
			let x = bar["width"] + this.#paddings["left"] + this.#padding;
			let y = bar["y"] + this.#bar_width / 2;

			this.#ctx.textBaseline = "middle";
			this.#ctx.textAlign = "left";
			this.#ctx.font = `1em ${this.#font_family}`;
			this.#ctx.fillStyle = this.#data["bar"]["values"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-primary") || "black";

			this.#ctx.fillText(bar["display_value"], x, y);
		}
	}

	#draw_x_axis_line(){
		if(!("x_axis" in this.#data) || !("line" in this.#data["x_axis"])) return;

		this.#ctx.beginPath();
		this.#ctx.setLineDash([this.#data["x_axis"]["line"]["line_dash"] || 0]);
		this.#ctx.moveTo(this.#paddings.left, this.#paddings.bottom);
		this.#ctx.lineTo(this.#paddings["right"], this.#paddings.bottom);

		this.#ctx.strokeStyle = this.#data["x_axis"]["line"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-primary") || "black";
		this.#ctx.lineWidth = 2;
		this.#ctx.stroke();
	}

	#draw_x_axis_markers(){
		if(!("x_axis" in this.#data) || !("marker" in this.#data["x_axis"])) return;

		for (let i = 0; i < this.#x_axis_marker_count; i++) {
			this.#ctx.textBaseline = "top";
			this.#ctx.textAlign = "center";
			this.#ctx.font = `1em ${this.#font_family}`;
			this.#ctx.fillStyle = this.#data["x_axis"]["marker"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-primary") || "black";

			let value = (this.#max_value - i * this.#x_axis_step_value).toFixed(0);
			let x = this.#paddings["right"] - (this.#x_axis_marker_gap * i);
			let y = this.#paddings["bottom"] + this.#padding;

			this.#ctx.fillText(value, x, y);
		}
	}

	#draw_y_axis_line(){
		if(!("y_axis" in this.#data) || !("line" in this.#data["y_axis"])) return;

		this.#ctx.beginPath();
		this.#ctx.setLineDash([this.#data["y_axis"]["line"]["line_dash"] || 0]);
		this.#ctx.moveTo(this.#paddings["left"], this.#paddings.bottom);
		this.#ctx.lineTo(this.#paddings["left"], this.#paddings.top);

		this.#ctx.strokeStyle = this.#data["y_axis"]["line"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-primary") || "black";
		this.#ctx.lineWidth = 2;
		this.#ctx.stroke();
		this.#ctx.closePath();
	}

	#draw_y_axis_markers(){
		if(!("y_axis" in this.#data) || !("marker" in this.#data["y_axis"])) return;

		this.#ctx.setLineDash([0]);
		this.#ctx.textBaseline = "middle";
		this.#ctx.font = `1em ${this.#font_family}`;

		if (this.#data["y_axis"]["marker"]?.["position"] === "on_bars")
			for (const bar of this.#bars) {
				let x = bar["x"] + this.#padding;
				let y = bar["y"] + this.#bar_width/2;
				let text = `${bar["label"]}: ${bar["display_value"]}`;

				this.#ctx.textAlign = "left";
				this.#ctx.strokeStyle = "black";
				this.#ctx.strokeText(text, x, y);
				this.#ctx.fillStyle = this.#data["y_axis"]["marker"]["color"] || "white";
				this.#ctx.fillText(text, x, y);

				y += this.#bar_width;
			}

		else
			for (const bar of this.#bars) {
				let x = bar["x"] - this.#padding;
				let y = bar["y"] + this.#bar_width/2;

				this.#ctx.textAlign = "right";
				this.#ctx.fillStyle = this.#data["y_axis"]["marker"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-primary") || "black";
				this.#ctx.fillText(bar["label"], x, y);

				y += this.#bar_width;
			}
	}

	#draw_y_axis_grid_lines(){
		if(!("grid" in this.#data)) return;

		this.#ctx.setLineDash([this.#data["grid"]["line_dash"] || 0]);
		this.#ctx.lineWidth = 0.5;
		this.#ctx.strokeStyle = this.#data["grid"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-primary") || "gray";

		for (let i = 0; i < this.#x_axis_marker_count; i++) {
			let x = this.#paddings["right"] - (this.#x_axis_marker_gap * i);

			this.#ctx.beginPath();
			this.#ctx.moveTo(x, this.#paddings["top"]);
			this.#ctx.lineTo(x, this.#paddings["bottom"]);
			this.#ctx.stroke();
		}
	}

	#init_on_hover_bar(){
		this.#canvas.addEventListener("mousemove", (event)=>{
			const rect = this.#canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			let hovered_bar= null;
			for(const bar of this.#bars) if(x >= bar.x && x <= bar.x + bar.width && y >= bar.y && y <= bar.y + bar.height) hovered_bar = bar;

			if(hovered_bar != null){
				let tooltip_height = this.#tooltip.getBoundingClientRect().height;
				this.#tooltip.style.display = "block";
				this.#tooltip.style.left = event.pageX + "px";
				this.#tooltip.style.top = event.pageY - tooltip_height - 5 + "px";
				this.#tooltip.textContent = `${hovered_bar.label}${hovered_bar["display_value"] && ": " + hovered_bar["display_value"]}`;
			}

			else this.#tooltip.style.display = "none";
		});
	}
}

window.customElements.define("x-bar-x-chart", Bar_x);
