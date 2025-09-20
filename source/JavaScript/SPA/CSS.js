export default class CSS{

	static get_value(variable){ return getComputedStyle(document.querySelector(':root')).getPropertyValue(variable); }

};

window.x["CSS"] = CSS;
