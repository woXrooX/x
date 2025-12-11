// const form = {
// 	"form": {
// 		"attributes": [{"method": "POST"}, {"class": "myForm"}],
// 		"childNodes": [
// 			{"input": {"attributes": [{"type": "text"}, {"name": "username"}, {"placeholder": "Username"}]}},
// 			{"br": {}},
// 			{"input": {"attributes": [{"type": "password"}, {"name": "password"}, {"placeholder": "Password"}]}},
// 			{"br": {}},
// 			{"input": {"attributes": [{"type": "submit"}, {"name": "log_in"}, {"value": "Log In"}]}}
// 		]
// 	}
// };
//
// const dom = JTD(form);
// console.log(dom);

export default function JTD(object){
	// Handle Invalid Types
	if(object == null) return;
	if(typeof object != "object") return;
	if(Object.keys(object).length !== 1) return;

	// Creating The Element
	const tagName = Object.keys(object)[0];
	const element = document.createElement(tagName);

	// Creating Attributes If Exists
	if("attributes" in object[tagName] && object[tagName]["attributes"].length > 0)
		for(const attribute of object[tagName]["attributes"])
			if(Object.keys(attribute).length === 1){
				const name = Object.keys(attribute)[0];
				const value = attribute[name];

				element.setAttribute(name, value);
			}

	// Creating Child Nodes If Exists
	if("childNodes" in object[tagName])
		for(const childNode of object[tagName]["childNodes"])
			element.appendChild(JTD(childNode));

	return element;
}
