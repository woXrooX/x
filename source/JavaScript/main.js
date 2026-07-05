import Core from "/JavaScript/SPA/Core.js";

try {
	await x.Core.init();
}

catch (error) {
	console.error("Main: Failed x.Core.init()");
	console.log(error);
}
