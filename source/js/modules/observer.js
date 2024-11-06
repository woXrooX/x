export default function observe({
	selector = ".observe",
	observe_once = false,
	delay = 0,
	// transitionVariables = {
	// 	duration = "500ms",
	// 	timingFunction = "ease-in-out",
	// 	delay = "250ms"
	// },
	options = {
		threshhold: 0,
		rootMargin: "0px"
	}
}){
	const observer = new IntersectionObserver(
		elements =>{
			for(let index = 0; index < elements.length; index++){
				const element = elements[index];
				setTimeout(() => {
					if(element.isIntersecting) element.target.classList.add("observed");
					else if(observeOnce === false) element.target.classList.remove("observed");
				}, delay * index);
			}
		},
		options
	);

	const elements = document.querySelectorAll(selector);

	if(!!elements === false) return;

	for(const element of elements) observer.observe(element);
}
