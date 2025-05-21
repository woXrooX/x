export default class Version_1 {
	static #canvas = null;
	static #ctx = null;

	/////////// APis

	static init(canvas, ctx){
		Version_1.#canvas = canvas;
		Version_1.#ctx = ctx;

		Version_1.#set_up_canvas();
		Version_1.#animate();
	}

	/////////// Helpers

	static #set_up_canvas(){
		Version_1.#canvas.style = `
			filter: blur(40px) contrast(150%);
			opacity: 0.7;
		`;
	}

	static #animate(){
		Version_1.#ctx.clearRect(0, 0, Version_1.#canvas.width, Version_1.#canvas.height);

		Version_1.#build_flowing_color_background();

		requestAnimationFrame(() => Version_1.#animate());
	}

	static #build_flowing_color_background(){
		const gradient = Version_1.#ctx.createLinearGradient(0, 0, Version_1.#canvas.width, Version_1.#canvas.height);
		const time = Date.now() * 0.001;

		gradient.addColorStop(0, `hsl(${Math.sin(time) * 60 + 120}, 70%, 50%)`);
		gradient.addColorStop(0.5, `hsl(${Math.cos(time * 0.8) * 60 + 240}, 70%, 50%)`);
		gradient.addColorStop(1, `hsl(${Math.sin(time * 0.6) * 60 + 360}, 70%, 50%)`);

		Version_1.#ctx.fillStyle = gradient;
		Version_1.#ctx.fillRect(0, 0, Version_1.#canvas.width, Version_1.#canvas.height);
	}
}
