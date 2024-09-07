export default class x_String{
	static {
		String.prototype.x_format = function(values){ return x_String.format(this, values); };
	}

	/////////// APIs
	///// Formatted string
	// Template: "Hello, {name}! You have {count} new messages."
	// Values: { name: "Alice", count: 5 };
	static format(template, values){
		return template.replace(/{(\w+)}/g, replacer);
		function replacer(match, key){ return values[key]; }
	}
}

window.x["String"] = x_String;
