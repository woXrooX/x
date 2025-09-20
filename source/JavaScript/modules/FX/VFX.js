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
};

window.x["VFX"] = VFX;
