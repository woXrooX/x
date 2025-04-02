// Usage:
// <x-pie-chart>
// 	{
// 		"legends": true,
// 		"hue": 230,
// 		"values": {
// 			"numeric": true,
// 			"percentage": true
// 		},
// 		"datasets": [
// 			{
// 				"label": "woXrooX",
// 				"value": 200
// 			},
// 			{
// 				"label": "Connexion",
// 				"value": 150
// 			},
// 			{
// 				"label": "Datalyse",
// 				"value": 50
// 			}
// 		]
// 	}
// </x-pie-chart>

export default class Pie extends HTMLElement {
	#data;
	#canvas;
	#ctx;
	#resize_observer_object = null;
	#animation_frame = null;

	#tooltip;

	#text_color = getComputedStyle(document.querySelector(":root")).getPropertyValue("--color-text-primary") || "black";
	#font_family = "Quicksand";
	#hue = 230;

	#x_center;
	#y_center;
	#pie_radius;
	#padding = 20;
	#hover_grow = 20;

	#total_value = 0;
	#slices = [];

	constructor(){
		super();

		this.shadow = this.attachShadow({ mode: "closed" });

		this.#data = JSON.parse(this.innerHTML).constructor === Object ? JSON.parse(this.innerHTML) : {};

		if (!("datasets" in this.#data) || this.#data["datasets"].length === 0) {
			this.shadow.innerHTML = "Pie: Invalid JSON";
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
			div#XE_charts_pie_tooltip{
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
		this.#tooltip.setAttribute("id", "XE_charts_pie_tooltip");
		this.shadow.appendChild(this.#tooltip);

		// Canvas element
		this.#canvas = document.createElement("canvas");
		this.shadow.appendChild(this.#canvas);
		this.#ctx = this.#canvas.getContext("2d");
	}

	connectedCallback() {
		this.#resize_observer();
	}

	disconnectedCallback() {
		// Clean up the observer when element is removed
		if (this.#resize_observer_object) {
		  this.#resize_observer_object.disconnect();
		  this.#resize_observer_object = null;
		}

		cancelAnimationFrame(this.#animation_frame);
	}

	////// APIs
	#resize_observer(){
		this.#resize_observer_object = new ResizeObserver(this.#init);
		this.#resize_observer_object.observe(this.parentNode);
	}

	#init = ()=>{
		this.#set_up_canvas();
		this.#init_values();
		this.#init_slices();
		this.#init_draw_canvas();
		this.#init_on_hover_slice();
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

		// Adjust canvas buffer size for DPR
		this.#canvas.width = css_width * DPR;
		this.#canvas.height = css_height * DPR;

		// Important: Save these CSS pixel values for calculations
		this.#x_center = css_width / 2;
		this.#y_center = css_height / 2;
		this.#pie_radius = Math.min(css_width, css_height) / 3;

		// Scale the context for DPR
		this.#ctx.scale(DPR, DPR);
	}

	#init_values(){
		if("text_color" in this.#data) this.#text_color = this.#data["text_color"];
		if("hue" in this.#data) this.#hue = this.#data["hue"];
		if("font_family" in this.#data) this.#font_family = this.#data["font_family"];
		if("background" in this.#data) this.#canvas.style.background = this.#data["background"];
	}

	#init_slices(){
		this.#total_value = 0;
		const sorted_slice_values = [];

		for(const slice of this.#data["datasets"]){
			this.#total_value += slice["value"];
			sorted_slice_values.push(slice["value"]);
		}

		sorted_slice_values.sort((a, b) => b - a);


		this.#slices = [];
		let start_angle = 0;

		for(const slice of this.#data["datasets"]){
			const slice_angle = (slice["value"] / this.#total_value) * 2 * Math.PI;

			const index_of_this_value = sorted_slice_values.indexOf(slice["value"]);
			const saturation = 20 + (60 / (this.#data["datasets"].length)) * index_of_this_value;
			const lightness = 20 + (60 / (this.#data["datasets"].length)) * index_of_this_value;

			let slice_percentage = ((slice["value"] / this.#total_value) * 100).toFixed(2);

			let display_value = '';
			if("values" in this.#data){
				if(this.#data["values"]["numeric"] == true && this.#data["values"]["percentage"] == true) display_value = `: ${slice["value"]} (${slice_percentage})%`;
				else if(this.#data["values"]["percentage"] == true) display_value = `: ${slice_percentage}%`;
				else if(this.#data["values"]["numeric"] == true) display_value = `: ${slice["value"]}`;
			}

			this.#slices.push({
				start: start_angle,
				end: start_angle + slice_angle,
				label: slice["label"],
				value: slice["value"],
				display_value: display_value,
				color: `hsl(${this.#hue}deg, ${saturation}%, ${lightness}%)`,
				hovered: false,
				current_radius: this.#pie_radius
			});
			start_angle += slice_angle;
		}
	}

	#init_draw_canvas(){
		this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

		this.#draw_slices();
		this.#draw_legends();
	}

	#draw_slices(){
		let needs_animation = false;

		for(const slice of this.#slices){
			// Animate radius
			if(slice.hovered && slice.current_radius < this.#pie_radius + this.#hover_grow){
				slice.current_radius += 1.5; // Speed of grow animation
				needs_animation = true;
			}

			else if(!slice.hovered && slice.current_radius > this.#pie_radius){
				slice.current_radius -= 1.5; // Speed of shrink animation
				needs_animation = true;
			}

			this.#ctx.beginPath();
			this.#ctx.moveTo(this.#x_center, this.#y_center);
			this.#ctx.arc(
				this.#x_center,
				this.#y_center,
				slice.current_radius,
				slice.start,
				slice.end
			);
			this.#ctx.closePath();

			this.#ctx.globalAlpha = slice["hovered"] ? 1 : 0.8;
			this.#ctx.fillStyle = slice["color"];
			this.#ctx.fill();

			// Border
			this.#ctx.globalAlpha = 1;
			this.#ctx.lineWidth = 2;
			this.#ctx.strokeStyle = "white";
			this.#ctx.stroke();
		}

		// Continue animation if needed
		if(needs_animation){
			cancelAnimationFrame(this.#animation_frame);  // Cancel previous frame
			this.#animation_frame = requestAnimationFrame(()=>this.#init_draw_canvas());
		}
	}

	#draw_legends(){
		if(!("legends" in this.#data) || this.#data["legends"] !== true) return;

		this.#ctx.font = `0.6em ${this.#font_family}`;
		this.#ctx.textAlign = "left";
		this.#ctx.textBaseline = "top";
		this.#ctx.globalAlpha = 1;

		let y = this.#padding;
		for(const slice of this.#slices){
			this.#ctx.beginPath();
			this.#ctx.roundRect(this.#padding, y, 30, 20, 5);
			this.#ctx.fillStyle = slice["color"];
			this.#ctx.fill();

			this.#ctx.fillStyle = this.#text_color;
			this.#ctx.fillText(`${slice["label"]}${slice["display_value"]}`, 60, y+5);

			y += 30;
		}
	}

	#init_on_hover_slice(){
		this.#canvas.addEventListener("mousemove", (event)=>{
			const rect = this.#canvas.getBoundingClientRect();
			const x = event.clientX - rect.left - this.#x_center;
			const y = event.clientY - rect.top - this.#y_center;
			const mouse_angle = (Math.atan2(y, x) + 2 * Math.PI) % (2 * Math.PI);
			const distance = Math.sqrt(x * x + y * y);

			let needs_redraw = false;
			let hovered_slice = null;
			for(const slice of this.#slices){
				const is_hovered = distance <= this.#pie_radius && mouse_angle >= slice.start && mouse_angle < slice.end;

				if(slice.hovered !== is_hovered){
					slice.hovered = is_hovered;
					needs_redraw = true;
				}

				if(is_hovered == true) hovered_slice = slice;
			}

			if(hovered_slice != null){
				let tooltip_height = this.#tooltip.getBoundingClientRect().height;
				this.#tooltip.style.display = "block";
				this.#tooltip.style.left = event.pageX + "px";
				this.#tooltip.style.top = event.pageY - tooltip_height - 5 + "px";
				this.#tooltip.textContent = `${hovered_slice.label}${hovered_slice["display_value"]}`;
			}else this.#tooltip.style.display = "none";

			if(needs_redraw) this.#init_draw_canvas();
		});
	}
}

window.customElements.define("x-pie-chart", Pie);
