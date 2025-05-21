export default class Version_3 {
	static #canvas = null;
	static #ctx = null;
	static #particle_objects = [];

	/////////// APis

	static init(canvas, ctx) {
		Version_3.#canvas = canvas;
		Version_3.#ctx = ctx;

		Version_3.#set_up_canvas();
		Version_3.#generate_particles();
		Version_3.#animate();
	}

	/////////// Helpers

	static #set_up_canvas(){
		Version_3.#canvas.style = `
			filter: blur(65px) contrast(130%) brightness(1.3);
			opacity: 0.9;
		`;
	}

	static #generate_particles(){
		Version_3.#particle_objects = [];
		for (let i = 0; i < 40; i++) Version_3.#particle_objects.push(new Particle(Version_3.#canvas, Version_3.#ctx));
	}

	static #animate() {
		Version_3.#ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
		Version_3.#ctx.fillRect(0, 0, Version_3.#canvas.width, Version_3.#canvas.height);

		Version_3.#draw_particles();

		requestAnimationFrame(() => Version_3.#animate());
	}

	static #draw_particles(){
		const time = Date.now() * 0.001;
		for (const particle of Version_3.#particle_objects) {
			particle.update(time);
			particle.draw();
		}
	}
}

class Particle {
	#canvas = null;
	#ctx = null;

	constructor(canvas, ctx) {
		this.#canvas = canvas;
		this.#ctx = ctx;

		this.#reset();

		// Radius with wider distribution to fill the canvas
		this.base_radius = Math.random() * 150 + 120;
		this.radius_variation = Math.random() * 50 + 30;
		this.pulse_speed = Math.random() * 0.02 + 0.01;
		this.color_shift = Math.random() * 0.01 + 0.005;

		// Set unique phase for organic motion
		this.phase_x = Math.random() * Math.PI * 2;
		this.phase_y = Math.random() * Math.PI * 2;
		this.amplitude = Math.random() * 2 + 1;
		this.hue = Math.random() * 360;
	}

	/////////// APis

	update(time) {
		// Add slight organic waviness to motion
		this.x += this.vx + Math.sin(time * 0.3 + this.phase_x) * this.amplitude * 0.2;
		this.y += this.vy + Math.cos(time * 0.2 + this.phase_y) * this.amplitude * 0.2;

		// Gentle friction
		this.vx *= 0.99;
		this.vy *= 0.99;

		// Pulse the radius for organic feel
		this.radius = this.base_radius + Math.sin(time * this.pulse_speed) * this.radius_variation;

		// Shift colors over time
		this.hue = (this.hue + this.color_shift) % 360;

		// Wrap around screen edges for seamless movement
		if (this.x < -this.radius) this.x = this.#canvas.width + this.radius;
		if (this.x > this.#canvas.width + this.radius) this.x = -this.radius;
		if (this.y < -this.radius) this.y = this.#canvas.height + this.radius;
		if (this.y > this.#canvas.height + this.radius) this.y = -this.radius;
	}

	draw() {
		// Create a radial gradient for each particle
		const gradient = this.#ctx.createRadialGradient(
			this.x, this.y, 0,
			this.x, this.y, this.radius
		);

		gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.8)`);
		gradient.addColorStop(0.6, `hsla(${(this.hue + 40) % 360}, ${this.saturation - 10}%, ${this.lightness - 5}%, 0.4)`);
		gradient.addColorStop(1, `hsla(${(this.hue + 80) % 360}, ${this.saturation - 20}%, ${this.lightness - 10}%, 0.1)`);

		this.#ctx.beginPath();
		this.#ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		this.#ctx.fillStyle = gradient;
		this.#ctx.fill();
	}

	/////////// Helpers

	#reset() {
		// Only reset position if constructor hasn't set it yet
		if (this.x === undefined) {
			this.x = Math.random() * this.#canvas.width;
			this.y = Math.random() * this.#canvas.height;
		}

		// Gentle movement
		this.vx = (Math.random() - 0.5) * 0.6;
		this.vy = (Math.random() - 0.5) * 0.6;

		// Saturation and lightness variation for richer colors
		this.hue = Math.random() * 360;
		this.saturation = 85 + Math.random() * 15;
		this.lightness = 55 + Math.random() * 25;
	}
}
