// Usage:
// <x-line-chart>
// 	{
// 		"legends": true,
// 		"data_points": true,
// 		"fill_type": "gradient",
// 		"x_axis": {
// 			"line": {
// 				"line_dash": 0,
// 				"color": "white"
// 			},
// 			"marker": {
// 				"color": "white",
// 				"markers": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
// 			}
// 		},
// 		"y_axis": {
// 			"line": {
// 				"line_dash": 0,
// 				"color": "white"
// 			},
// 			"marker": {
// 				"color": "white",
// 				"count": 5
// 			}
// 		},
// 		"grid": {
// 			"x": true,
// 			"y": true,
// 			"line_dash": 10,
// 			"color": "white"
// 		},
// 		"datasets": [
// 			{
// 				"label": "A",
// 				"line_dash": 10,
// 				"color": "#ef9b20",
// 				"data": [50, 20, 0, -250, 400]
// 			},
// 			{
// 				"label": "B",
// 				"line_dash": 0,
// 				"color": "#27aeef",
// 				"data": [150, 50, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 300, 350, 400, 450, 500, 550, 600, 650]
// 			},
// 			{
// 				"label": "C",
// 				"line_dash": 0,
// 				"color": "#b33dc6",
// 				"data": [-50, 70, 20, 90, 150, 120, 180]
// 			}
// 		]
// 	}
// </x-line-chart>

export default class Line extends HTMLElement{
	#data;
	#canvas;
	#ctx;
	#resize_observer_object = null;
	#tooltip;
	#font_size = 16;

	#rotated_labels = false;

	#padding = 20;
	#paddings;

	#min_value = Infinity;
	#max_value = -Infinity;

	#x_axis_gap = 0;
	#x_axis_marker_count = 0;

	#y_axis_gap = 0;
	#y_axis_scale;
	#y_axis_marker_count = 10;
	#y_axis_step_value;

	#circle_rad = 4;

	#grid_line_width = 0.2;
	#grid_outside_size = 10;

	#canvas_DPI_width = 0;
	#canvas_DPI_height = 0;

	constructor(){
		super();

		this.shadow = this.attachShadow({mode: 'closed'});

		this.#data = JSON.parse(this.innerHTML).constructor === Object ? JSON.parse(this.innerHTML) : {};

		if (!("datasets" in this.#data) || this.#data["datasets"].length === 0) {
			this.shadow.innerHTML = "Line: Invalid JSON";
			return;
		}

		// Style element
		const style = document.createElement('style');
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
			div#XE_charts_line_tooltip{
				position: absolute;
				display: none;
				background-color: rgba(0, 0, 0, 0.7);
				color: white;
				padding: 5px;
				border-radius: 5px;
				pointer-events: none;
				font-size: 0.7em;
			}
		`;
		this.shadow.appendChild(style);

		// Tooltip element
		this.#tooltip = document.createElement("div");
		this.#tooltip.setAttribute("id", "XE_charts_line_tooltip");
		this.shadow.appendChild(this.#tooltip);

		// Canvas element
		this.shadow.appendChild(document.createElement("canvas"));
		this.#canvas = this.shadow.querySelector("canvas");
		this.#ctx = this.#canvas.getContext('2d');
	}

	connectedCallback() {
		this.#resize_observer();
		this.#init_on_hover_points();
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

		this.#draw_legends();

		this.#draw_grid_x_lines();
		this.#draw_grid_y_lines();

		this.#draw_data_fill_type_opacity_or_plain();
		this.#draw_data_fill_type_gradient();

		this.#draw_x_axis_line();
		this.#draw_x_axis_markers();

		this.#draw_y_axis_line();
		this.#draw_y_axis_markers();

		this.#draw_data_lines();
		this.#draw_data_points();
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

		// Adjust canvas buffer size for DPR
		this.#canvas.width = css_width * DPR;
		this.#canvas.height = css_height * DPR;

		// Scale the context for DPR
		this.#ctx.scale(DPR, DPR);
	}

	#init_values(){
		this.#y_axis_marker_count = this.#data?.y_axis?.marker?.count ?? this.#y_axis_marker_count;
		this.#ctx.font = `${this.#font_size}px Quicksand`;

		this.#paddings = {
			top: this.#padding,
			right: this.#canvas_DPI_width - this.#padding,
			bottom: this.#canvas_DPI_height - this.#padding,
			left: this.#padding
		};
	}

	#calculate_values(){
		let initial_line_height = this.#canvas_DPI_height - this.#padding * 2;
		let actual_line_height = initial_line_height;

		// Finding min max
		for(let i = 0; i < this.#data["datasets"].length; i++){
			const min = Math.min(...this.#data["datasets"][i]["data"]);
			const max = Math.max(...this.#data["datasets"][i]["data"]);
			if(min < this.#min_value) this.#min_value = min;
			if(max > this.#max_value) this.#max_value = max;

			// Longest dataset (longest x_axis marker coount)
			if(this.#data["datasets"][i]["data"].length > this.#x_axis_marker_count) this.#x_axis_marker_count = this.#data["datasets"][i]["data"].length;
		}

		// Creating space for legends
		if(this.#data["legends"] === true){
			this.#paddings["top"] += this.#font_size + this.#padding;
			actual_line_height = initial_line_height - (this.#paddings["top"] + this.#padding);
		}

		if("x_axis" in this.#data && "marker" in this.#data["x_axis"]){
			this.#paddings["bottom"] -= this.#font_size + this.#padding;

			let rotated_longest_marker_width = 0;
			let total_text_markers_length = 0;
			if("markers" in this.#data["x_axis"]["marker"] && this.#data["x_axis"]["marker"]["markers"].length > 1){
				this.#x_axis_marker_count = this.#data["x_axis"]["marker"]["markers"].length;

				if(total_text_markers_length == 0)
					for(const marker of this.#data["x_axis"]["marker"]["markers"])
						total_text_markers_length += this.#ctx.measureText(marker).width + this.#padding * 2;

				this.#paddings["left"] += this.#ctx.measureText(this.#data["x_axis"]["marker"]["markers"][0]).width / 2;
				this.#paddings["right"] -= this.#ctx.measureText(this.#data["x_axis"]["marker"]["markers"][this.#data["x_axis"]["marker"]["markers"].length - 1]).width / 2;

				this.#rotated_labels = false;
				if(total_text_markers_length>= this.#canvas_DPI_width) this.#rotated_labels = true;
				if(this.#rotated_labels == true){
					let longest_marker_text = this.#data["x_axis"]["marker"]["markers"].slice().sort((a, b) => b.length - a.length)[0];
					rotated_longest_marker_width = this.#ctx.measureText(longest_marker_text).width;
					this.#paddings["bottom"] -= rotated_longest_marker_width;
				}
			}

			actual_line_height = initial_line_height - (this.#paddings["top"] + this.#font_size + rotated_longest_marker_width);
		}

		if("y_axis" in this.#data && "marker" in this.#data["y_axis"]){
			let actual_space = this.#paddings["left"] - (this.#ctx.measureText(this.#max_value).width + this.#padding * 2);
			this.#paddings["left"] += actual_space > 0 ? 0 : (actual_space * -1) + this.#padding;
		}

		this.#x_axis_gap = (this.#paddings["right"] - this.#paddings["left"]) / (this.#x_axis_marker_count - 1);
		this.#y_axis_gap = (this.#paddings["bottom"] - this.#paddings["top"]) / (this.#y_axis_marker_count - 1);
		this.#y_axis_scale = actual_line_height / (this.#max_value - this.#min_value);
		this.#y_axis_step_value = (this.#max_value - this.#min_value) / (this.#y_axis_marker_count - 1);
	}

	#draw_x_axis_line(){
		if(!("x_axis" in this.#data) || !(this.#data["x_axis"]["line"])) return;

		this.#ctx.beginPath();
		this.#ctx.setLineDash([this.#data["x_axis"]["line"]["line_dash"] || 0]);
		this.#ctx.moveTo(this.#paddings.left, this.#paddings.bottom);
		this.#ctx.lineTo(this.#paddings.right, this.#paddings.bottom);

		this.#ctx.strokeStyle = this.#data["x_axis"]["line"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-primary") || "black";
		this.#ctx.lineWidth = 1;
		this.#ctx.stroke();
	}

	#draw_x_axis_markers(){
		if(!("x_axis" in this.#data) || !("marker" in this.#data["x_axis"])) return;

		this.#ctx.fillStyle = this.#data["x_axis"]["marker"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-primary") || "black";
		const has_markers = this.#data?.x_axis?.marker?.markers ? true : false;

		for(let i = 0; i < this.#x_axis_marker_count; i++){
			const x = i * this.#x_axis_gap + this.#paddings["left"];
			const label = has_markers ? this.#data["x_axis"]["marker"]["markers"][i] : i;

			if(this.#rotated_labels === true){
				this.#ctx.save();
				this.#ctx.translate(x, this.#paddings["bottom"] + this.#padding);
				this.#ctx.rotate(Math.PI / 2);
				this.#ctx.textAlign = "left";
				this.#ctx.fillText(label, 0, 0);
				this.#ctx.restore();
			}

			else{
				this.#ctx.textBaseline = "top";
				this.#ctx.textAlign = "center";
				this.#ctx.fillText(label, x, this.#paddings["bottom"] + this.#padding);
			}
		}
	}

	#draw_y_axis_line(){
		if(!("y_axis" in this.#data) || !("line" in this.#data["y_axis"])) return;

		this.#ctx.beginPath();
		this.#ctx.setLineDash([this.#data["y_axis"]["line"]["line_dash"] || 0]);
		this.#ctx.moveTo(this.#paddings.left, this.#paddings.top);
		this.#ctx.lineTo(this.#paddings.left, this.#paddings.bottom);

		this.#ctx.strokeStyle = this.#data["y_axis"]["line"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-primary") || "black";
		this.#ctx.lineWidth = 1;
		this.#ctx.stroke();
	}

	#draw_y_axis_markers(){
		if(!("y_axis" in this.#data) || !("marker" in this.#data["y_axis"])) return;

		for(let i = 0; i < this.#y_axis_marker_count; i++){
			this.#ctx.textAlign = "right";
			this.#ctx.fillStyle = this.#data["y_axis"]["marker"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-primary") || "black";
			this.#ctx.textBaseline = "middle";
			this.#ctx.fillText((this.#max_value - i * this.#y_axis_step_value).toFixed(1), this.#paddings.left - this.#padding, i * this.#y_axis_gap + this.#paddings["top"]);
		}
	}

	#draw_grid_x_lines(){
		if(!("grid" in this.#data)) return;
		if(this.#data["grid"]["x"] !== true) return;

		this.#ctx.strokeStyle = this.#data["grid"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-secondary") || "gray";
		this.#ctx.lineWidth = this.#grid_line_width;
		this.#ctx.setLineDash([this.#data["grid"]["line_dash"] || 0]);

		for (let i = 0; i < this.#y_axis_marker_count; i++) {
			this.#ctx.beginPath();
			this.#ctx.moveTo(this.#paddings.left - this.#grid_outside_size, this.#y_axis_gap * i + this.#paddings["top"]);
			this.#ctx.lineTo(this.#paddings.right, this.#y_axis_gap * i + this.#paddings["top"]);
			this.#ctx.stroke();
		}
	}

	#draw_grid_y_lines(){
		if(!("grid" in this.#data)) return;
		if(this.#data["grid"]["y"] !== true) return;

		this.#ctx.strokeStyle = this.#data["grid"]["color"] || getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-secondary") || "gray";
		this.#ctx.lineWidth = this.#grid_line_width;
		this.#ctx.setLineDash([this.#data["grid"]["line_dash"] || 0]);

		for(let i = 0; i < this.#x_axis_marker_count; i++){
			const x = i * this.#x_axis_gap + this.#paddings["left"];
			this.#ctx.beginPath();
			this.#ctx.moveTo(x, this.#paddings.top);
			this.#ctx.lineTo(x, this.#paddings.bottom + this.#grid_outside_size);
			this.#ctx.stroke();
		}
	}

	#draw_data_lines(){
		this.#ctx.lineWidth = 2;

		for(let i = 0; i < this.#data["datasets"].length; i++){
			this.#ctx.beginPath();
			this.#ctx.moveTo(this.#paddings["left"], this.#paddings["bottom"] - (this.#data["datasets"][i]["data"][0] - this.#min_value) * this.#y_axis_scale);
			this.#ctx.strokeStyle = this.#data["datasets"][i]["color"] || "black";
			this.#ctx.setLineDash([this.#data["datasets"][i]["line_dash"] || 0]);

			for(let j = 0; j < this.#x_axis_marker_count; j++)
				this.#ctx.lineTo(
					j * this.#x_axis_gap + this.#paddings["left"],
					this.#paddings["bottom"] - (this.#data["datasets"][i]["data"][j] - this.#min_value) * this.#y_axis_scale
				);

			this.#ctx.stroke();
		}
	}

	#draw_data_points(){
		if(!("data_points" in this.#data) || this.#data["data_points"] !== true) return;

		for (let i = 0; i < this.#data["datasets"].length; i++) for(let j = 0; j < this.#x_axis_marker_count; j++) {
			const x = j * this.#x_axis_gap + this.#paddings["left"];
			const y = this.#paddings.bottom - (this.#data["datasets"][i]["data"][j] - this.#min_value) * this.#y_axis_scale;
			this.#ctx.beginPath();
			this.#ctx.fillStyle = this.#data["datasets"][i]["color"];
			this.#ctx.arc(x, y, this.#circle_rad, 0, Math.PI * 2);
			this.#ctx.fill();
		}
	}

	#draw_data_fill_type_opacity_or_plain(){
		if(!("fill_type" in this.#data)) return;
		if(this.#data["fill_type"] !== "plain" && this.#data["fill_type"] !== "opacity") return;

		for(const line of this.#data["datasets"]){
			this.#ctx.beginPath();

			for(let i = 0; i < this.#x_axis_marker_count; i++){
				this.#ctx.lineTo(
					i * this.#x_axis_gap + this.#paddings["left"],
					this.#paddings.bottom - (line["data"][i] - this.#min_value) * this.#y_axis_scale
				);

				if(i == (this.#x_axis_marker_count - 1)){
					let last_data_point = this.#x_axis_marker_count < line["data"].length ? this.#x_axis_marker_count : line["data"].length;

					this.#ctx.lineTo(
						((last_data_point - 1) * this.#x_axis_gap + this.#paddings["left"]),
						this.#paddings.bottom
					);
					this.#ctx.lineTo(this.#paddings.left, this.#paddings.bottom);
					this.#ctx.fillStyle = line["color"];
					this.#ctx.globalAlpha = this.#data["fill_type"] === "plain" ? 1 : 0.1;
					this.#ctx.closePath();
				}
			}

			this.#ctx.fill();
		}

		this.#ctx.globalAlpha = 1;
	}

	#draw_data_fill_type_gradient(){
		if(!("fill_type" in this.#data)) return;
		if(this.#data["fill_type"] !== "gradient") return;

		this.#ctx.globalAlpha = 0.5;

		for(const line of this.#data["datasets"]){
			this.#ctx.beginPath();

			const gradient = this.#ctx.createLinearGradient(
				this.#padding,
				this.#paddings.bottom - (Math.max(...line["data"]) - this.#min_value) * this.#y_axis_scale,
				this.#padding,
				this.#paddings.bottom
			);

			gradient.addColorStop(0, line["color"]);
			gradient.addColorStop(1, "rgba(255, 255, 255, 0");
			this.#ctx.fillStyle = gradient;

			for(let i = 0; i < this.#x_axis_marker_count; i++){
				this.#ctx.lineTo(
					i * this.#x_axis_gap + this.#paddings["left"],
					this.#paddings.bottom - (line["data"][i] - this.#min_value) * this.#y_axis_scale
				);

				if(i == (this.#x_axis_marker_count - 1)){
					let last_data_point = this.#x_axis_marker_count < line["data"].length ? this.#x_axis_marker_count : line["data"].length;

					this.#ctx.lineTo(
						((last_data_point - 1) * this.#x_axis_gap + this.#paddings["left"]),
						this.#paddings.bottom
					);
					this.#ctx.lineTo(this.#paddings.left, this.#paddings.bottom);
					this.#ctx.closePath();
				}

			}

			this.#ctx.fill();
		}

		this.#ctx.globalAlpha = 1;
	}

	#draw_legends(){
		if(!("legends" in this.#data) || this.#data["legends"] !== true) return;

		const rect_width = 30;
		const rect_height = this.#font_size;
		const gap = rect_width + 10;
		let start_x = (this.#canvas_DPI_width) / 2;

		this.#ctx.textBaseline = "middle";
		this.#ctx.textAlign = "left";

		for(let i = 0; i < this.#data["datasets"].length; i++) start_x -= this.#ctx.measureText(this.#data["datasets"][i]["label"]).width / 2;

		// start_x = Rectangles + Gaps
		start_x -= (this.#data["datasets"].length * rect_width / 2) + ((this.#data["datasets"].length - 1) * gap / 2);

		for(let i = 0; i < this.#data["datasets"].length; i++){
			this.#ctx.beginPath();
			this.#ctx.roundRect(start_x, this.#padding - (rect_height / 2), rect_width, rect_height, 5);
			this.#ctx.fillStyle = this.#data["datasets"][i]["color"];
			this.#ctx.fillText(this.#data["datasets"][i]["label"], start_x + gap, this.#padding);
			this.#ctx.fill();
			start_x += rect_width + this.#ctx.measureText(this.#data["datasets"][i]["label"]).width + gap;
		}
	}

	#init_on_hover_points(){
		if(this.#data["data_points"] !== true) return;

		this.#canvas.addEventListener('mousemove', (event) => {
			const rect = this.#canvas.getBoundingClientRect();
			const mouse_x = event.clientX - rect.left;
			const mouse_y = event.clientY - rect.top;

			let hovered_point = null;
			let min_distance = Infinity;

			for(const line of this.#data["datasets"]) for(let i = 0; i < this.#x_axis_marker_count; i++){
				const x = i * this.#x_axis_gap + this.#paddings["left"];
				const y = this.#paddings.bottom - (line["data"][i] - this.#min_value) * this.#y_axis_scale;

				// Calculate distance from mouse to point
				const distance = Math.sqrt(Math.pow(mouse_x - x, 2) + Math.pow(mouse_y - y, 2));

				// If this point is closer than previous closest point
				if (distance < min_distance && distance < this.#grid_outside_size) {
					min_distance = distance;
					hovered_point = { label: line["label"], value: line["data"][i] };
				}
			}

			if(hovered_point != null) {
				let tooltip_height = this.#tooltip.getBoundingClientRect().height;
				this.#tooltip.style.display = 'block';
				this.#tooltip.style.left = event.pageX + "px";
				this.#tooltip.style.top = event.pageY - tooltip_height - 5 + "px";
				this.#tooltip.textContent = `${hovered_point["label"]}: ${hovered_point["value"].toFixed(0)}`;
			}

			else this.#tooltip.style.display = 'none';
		});
	}
}

window.customElements.define('x-line-chart', Line);
