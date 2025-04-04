export default class Body{
	static element = window.document.body;

	static lock_scroll_y_axis(){
		Body.element.classList.add("overflow-hidden");
	}

	static unlock_scroll_y_axis(){
		Body.element.classList.remove("overflow-hidden");
	}
};

window.x["Body"] = Body;
