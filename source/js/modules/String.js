export default class x_String{
	static {
		String.prototype.x_template_decoder = function(values){ return x_String.template_decoder(this, values); };
	}

	/////////// APIs
	///// Template decoder
	// Template: "Hello, {name}! You have {count} new messages."
	// Values: { name: "Alice", count: 5 };
	template_decoder(template, values){
		return template.replace(/{(\w+)}/g, replacer);
		function replacer(match, key){ return values[key]; }
	}
}

window.x["String"] = x_String;
