export default class x_String{
	static {
		String.prototype.x_format = function(values) { return x_String.format(this, values); };
		String.prototype.x_capitalize_first = function() { return x_String.capitalize_first(this); };
	}

	/////////// APIs
	///// Formatted string
	// Template: "Hello, {name}! You have {count} new messages."
	// Values: { name: "Alice", count: 5 };
	static format(template, values){
		return template.replace(/{(\w+)}/g, replacer);
		function replacer(match, key){ return values[key]; }
	}

	static capitalize_first(str) {
		if (!str) return '';
		return str[0].toUpperCase() + str.slice(1);
	}
}

window.x["String"] = x_String;
