export default class Version_4 {
	static #canvas = null;
	static #ctx = null;
	static #particle_objects = [];

	/////////// APis

	static init(canvas, ctx) {
		Version_4.#canvas = canvas;
		Version_4.#ctx = ctx;

		Version_4.#set_up_canvas();
		Version_4.#generate_particles();
		Version_4.#animate();
	}

	/////////// Helpers

	static #set_up_canvas(){
		Version_4.#canvas.style = `
			filter: blur(85px) contrast(130%) brightness(1.3);
			opacity: 0.9;

		`;
	}

	static #generate_particles(){
		Version_4.#particle_objects = [];
		for (let i = 0; i < 12; i++) Version_4.#particle_objects.push(new Particle(Version_4.#canvas, Version_4.#ctx));
	}

	static #animate() {
		Version_4.#ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
		Version_4.#ctx.fillRect(0, 0, Version_4.#canvas.width, Version_4.#canvas.height);

		Version_4.#draw_particles();

		requestAnimationFrame(() => Version_4.#animate());
	}

	static #draw_particles(){
		const time = Date.now() * 0.001;
		for (const particle of Version_4.#particle_objects) {
			particle.update(time);
			particle.draw();
		}
	}
}

class Particle {
	#canvas = null;
	#ctx = null;

	constructor (canvas, ctx) {
		this.#canvas = canvas;
		this.#ctx = ctx;

		this.#reset();

		// Gigantic radius that extends beyond visible screen
		this.base_radius = Math.random() * 300 + 450;
		this.radius_variation = Math.random() * 150 + 100;

		// Subtle animation parameters
		this.pulse_speed = Math.random() * 0.006 + 0.002;
		this.color_shift = Math.random() * 0.008 + 0.002;

		// Organic motion parameters
		this.phase_x = Math.random() * Math.PI * 2;
		this.phase_y = Math.random() * Math.PI * 2;
		this.amplitude = Math.random() * 2.5 + 0.5;

		this.hue_options = [210, 280, 190, 330, 35];
		this.hue = this.hue_options[Math.floor(Math.random() * this.hue_options.length)];

		// Distribute particles to include off-screen areas
		const margin = 300;
		this.x = Math.random() * (this.#canvas.width + margin*2) - margin;
		this.y = Math.random() * (this.#canvas.height + margin*2) - margin;
	}

	/////////// APis

	update(time) {
		// Extremely subtle motion with easing
		this.x += this.vx + Math.sin(time * 0.15 + this.phase_x) * this.amplitude * 0.1;
		this.y += this.vy + Math.cos(time * 0.1 + this.phase_y) * this.amplitude * 0.1;

		// Minimal friction for very smooth transitions
		this.vx *= 0.997;
		this.vy *= 0.997;

		// Gentle radius pulsing
		this.radius = this.base_radius + Math.sin(time * this.pulse_speed) * this.radius_variation;

		// Subtle color shifting
		this.hue = (this.hue + this.color_shift) % 360;

		// Handle offscreen with large margins
		const margin = this.radius;
		if (this.x < -margin) this.x = this.#canvas.width + margin/3;
		if (this.x > this.#canvas.width + margin) this.x = -margin/3;
		if (this.y < -margin) this.y = this.#canvas.height + margin/3;
		if (this.y > this.#canvas.height + margin) this.y = -margin/3;
	}

	draw() {
		// Enhanced gradient with multiple stops for more depth
		const gradient = this.#ctx.createRadialGradient(
			this.x, this.y, 0,
			this.x, this.y, this.radius
		);

		// Apple-inspired gradient with multiple color transitions
		gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.75)`);
		gradient.addColorStop(0.4, `hsla(${(this.hue + 20) % 360}, ${this.saturation - 5}%, ${this.lightness - 2}%, 0.5)`);
		gradient.addColorStop(0.7, `hsla(${(this.hue + 40) % 360}, ${this.saturation - 10}%, ${this.lightness - 5}%, 0.3)`);
		gradient.addColorStop(1, `hsla(${(this.hue + 60) % 360}, ${this.saturation - 15}%, ${this.lightness - 10}%, 0.1)`);

		this.#ctx.beginPath();
		this.#ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		this.#ctx.fillStyle = gradient;
		this.#ctx.fill();
	}

	/////////// Helpers

	#reset() {
		// Keep existing position if already set
		if (this.x === undefined) {
			const margin = 300;
			this.x = Math.random() * (this.#canvas.width + margin*2) - margin;
			this.y = Math.random() * (this.#canvas.height + margin*2) - margin;
		}

		// Ultra-slow, deliberate movement (Apple-like)
		this.vx = (Math.random() - 0.5) * 0.2;
		this.vy = (Math.random() - 0.5) * 0.2;

		// Refined color parameters
		this.saturation = 70 + Math.random() * 20;
		this.lightness = 60 + Math.random() * 15;
	}
}
