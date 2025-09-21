// Visual Effects
export default class VFX {

	static border_flash(element, type, duration = 1000){
		if (!!element === false) return;
		if (!x.Notification.types.includes(type)) return;

		const classes_string = `outline-${type}`;

		element.classList.add(classes_string);

		setTimeout(()=>{
			element.classList.remove(classes_string);
		}, duration);
	}

	static shake(element, duration = 600){
		if (!!element === false) return;

		// Reject NaN/Infinity/negatives
		const valid_duration = (typeof(duration) === "number" && isFinite(duration) && duration > 0) ? duration : 600;

		const sequences = [0, -2, 4, -8, 8, -8, 8, -4, 2, -2, 0];

		// Cancel previous shake if any
		if (element.x_VFX_shake && typeof element.x_VFX_shake.cancel === 'function')
			try { element.x_VFX_shake.cancel(); }
			catch(e){}

		element.style.willChange = 'transform';

		if (element.animate){
			const keyframes = [];
			for (let i = 0; i < sequences.length; i++){
				const frame = { transform: `translate3d(${sequences[i]}px,0,0)` };
				if (i > 0 && i < sequences.length - 1) frame.offset = i * 0.1;
				keyframes.push(frame);
			}

			const animation = element.animate(keyframes, {
				duration: valid_duration,
				easing: 'cubic-bezier(.36,.07,.19,.97)',
				fill: 'none'
			});

			element.x_VFX_shake = animation;

			const clean_up = ()=>{
				// Ignore stale cleanups from an older run
				if (element.x_VFX_shake !== animation) return;

				element.style.removeProperty('will-change');
				element.x_VFX_shake = null;
			};

			animation.addEventListener && animation.addEventListener("finish", clean_up, { once: true });
			animation.addEventListener && animation.addEventListener("cancel", clean_up, { once: true });
			animation.finished && animation.finished.then(()=>clean_up(), ()=>clean_up());
			setTimeout(clean_up, valid_duration + 100);

			return;
		}

		// Fallback (no WAAPI) - cancelable
		const ms = valid_duration;
		const original = element.style.transform;

		let cancelled = false;
		const token = { cancel: ()=>{ cancelled = true; element.style.removeProperty('will-change'); } };
		element.x_VFX_shake = token;

		let i = 0;
		const tick = ()=>{
			if (cancelled) return;

			element.style.transform = 'translate3d(' + sequences[i] + 'px,0,0)';

			i++;

			if (i < sequences.length) setTimeout(tick, ms / (sequences.length - 1));

			else {
				if (original) element.style.transform = original;
				else element.style.removeProperty('transform');

				element.style.removeProperty('will-change');

				if (element.x_VFX_shake === token) element.x_VFX_shake = null;
			}
		};

		tick();
	}
};

window.x["VFX"] = VFX;
